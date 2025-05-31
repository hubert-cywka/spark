locals {
  kafka_image = "apache/kafka:3.9.1"
  fs_group_id = 1000

  kafka_broker_node_id_base     = 1
  kafka_controller_node_id_base = 1001

  kafka_controller_quorum_voters = join(",", [
    for i in range(var.controller_replicas) : "${local.kafka_controller_node_id_base + i}@kafka-controller-${i}.kafka-controller-headless.${var.namespace}.svc.cluster.local:${var.controller_internal_port}"
  ])

  brokers = join(",", [
    for i in range(var.broker_replicas) : "kafka-broker-${i}.kafka-broker-headless.${var.namespace}.svc.cluster.local:${var.broker_internal_port}"
  ])
}

resource "kubernetes_stateful_set" "kafka_controller" {
  metadata {
    name      = "kafka-controller"
    namespace = var.namespace
  }
  spec {
    replicas     = var.controller_replicas
    service_name = "kafka-controller-headless"
    selector {
      match_labels = {
        app = "kafka-controller"
      }
    }
    template {
      metadata {
        labels = {
          app = "kafka-controller"
        }
      }
      spec {
        security_context {
          fs_group = local.fs_group_id
        }
        container {
          name  = "kafka-controller"
          image = local.kafka_image

          command = ["/bin/bash", "-c"]

          args = [
            <<-EOF
            set -e
            ORDINAL=$(echo $HOSTNAME | awk -F'-' '{print $NF}')
            export KAFKA_NODE_ID=$((ORDINAL + ${local.kafka_controller_node_id_base}))
            exec /etc/kafka/docker/run
            EOF
          ]

          startup_probe {
            tcp_socket {
              port = var.controller_internal_port
            }
            initial_delay_seconds = 20
            period_seconds        = 10
            failure_threshold     = 30
          }

          liveness_probe {
            tcp_socket {
              port = var.controller_internal_port
            }
            period_seconds    = 15
            timeout_seconds   = 5
            failure_threshold = 3
          }

          env {
            name  = "CLUSTER_ID"
            value = var.cluster_id
          }
          env {
            name  = "KAFKA_PROCESS_ROLES"
            value = "controller"
          }
          env {
            name  = "KAFKA_LISTENERS"
            value = "CONTROLLER://:${var.controller_internal_port}"
          }
          env {
            name  = "KAFKA_CONTROLLER_LISTENER_NAMES"
            value = "CONTROLLER"
          }
          env {
            name  = "KAFKA_CONTROLLER_QUORUM_VOTERS"
            value = local.kafka_controller_quorum_voters
          }
          env {
            name  = "KAFKA_LOG_DIRS"
            value = "/kafka/data"
          }

          port {
            container_port = var.controller_internal_port
            name           = "controller"
          }
          volume_mount {
            mount_path = "/kafka/data"
            name       = "kafka-controller-data"
          }
        }
      }
    }
    volume_claim_template {
      metadata {
        name = "kafka-controller-data"
      }
      spec {
        access_modes = ["ReadWriteOnce"]
        resources {
          requests = {
            storage = var.controller_volume_size_request
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "kafka_controller_headless" {
  metadata {
    name      = "kafka-controller-headless"
    namespace = var.namespace
  }
  spec {
    cluster_ip = "None"
    selector = {
      app = "kafka-controller"
    }
    port {
      protocol    = "TCP"
      port        = var.controller_internal_port
      target_port = var.controller_internal_port
    }
  }
}

resource "kubernetes_stateful_set" "kafka_broker" {
  metadata {
    name      = "kafka-broker"
    namespace = var.namespace
  }
  spec {
    replicas     = var.broker_replicas
    service_name = "kafka-broker-headless"
    selector {
      match_labels = {
        app = "kafka-broker"
      }
    }
    template {
      metadata {
        labels = {
          app = "kafka-broker"
        }
      }
      spec {
        security_context {
          fs_group = local.fs_group_id
        }
        container {
          name  = "kafka-broker"
          image = local.kafka_image

          command = ["/bin/bash", "-c"]
          args = [
            <<-EOF
            set -e
            ORDINAL=$(echo $HOSTNAME | awk -F'-' '{print $NF}')
            export KAFKA_NODE_ID=$((ORDINAL + ${local.kafka_broker_node_id_base}))
            export KAFKA_ADVERTISED_LISTENERS="PLAINTEXT://$HOSTNAME.kafka-broker-headless.${var.namespace}.svc.cluster.local:${var.broker_internal_port}"
            exec /etc/kafka/docker/run
            EOF
          ]

          startup_probe {
            tcp_socket {
              port = var.broker_internal_port
            }
            initial_delay_seconds = 20
            period_seconds        = 10
            failure_threshold     = 30
          }

          liveness_probe {
            tcp_socket {
              port = var.broker_internal_port
            }
            period_seconds    = 15
            timeout_seconds   = 5
            failure_threshold = 3
          }

          env {
            name  = "CLUSTER_ID"
            value = var.cluster_id
          }
          env {
            name  = "KAFKA_PROCESS_ROLES"
            value = "broker"
          }
          env {
            name  = "KAFKA_LISTENERS"
            value = "PLAINTEXT://:${var.broker_internal_port}"
          }
          env {
            name  = "KAFKA_INTER_BROKER_LISTENER_NAME"
            value = "PLAINTEXT"
          }
          env {
            name  = "KAFKA_CONTROLLER_LISTENER_NAMES"
            value = "CONTROLLER"
          }
          env {
            name  = "KAFKA_LISTENER_SECURITY_PROTOCOL_MAP"
            value = "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT"
          }
          env {
            name  = "KAFKA_CONTROLLER_QUORUM_VOTERS"
            value = local.kafka_controller_quorum_voters
          }
          env {
            name  = "KAFKA_LOG_DIRS"
            value = "/kafka/data"
          }
          env {
            name  = "KAFKA_NUM_PARTITIONS"
            value = var.num_partitions
          }
          env {
            name  = "KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS"
            value = "0"
          }

          port {
            container_port = var.broker_internal_port
            name           = "broker-internal"
          }
          volume_mount {
            mount_path = "/kafka/data"
            name       = "kafka-broker-data"
          }
        }
      }
    }
    volume_claim_template {
      metadata {
        name = "kafka-broker-data"
      }
      spec {
        access_modes = ["ReadWriteOnce"]
        resources {
          requests = {
            storage = var.broker_volume_size_request
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "kafka_broker_headless_service" {
  metadata {
    name      = "kafka-broker-headless"
    namespace = var.namespace
  }
  spec {
    cluster_ip = "None"
    selector = {
      app = "kafka-broker"
    }
    port {
      protocol    = "TCP"
      port        = var.broker_internal_port
      target_port = var.broker_internal_port
    }
  }
}
