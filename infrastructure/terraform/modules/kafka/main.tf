locals {
  kafka_namespace_name = var.namespace
  kafka_image          = "apache/kafka:3.9.1"
  fs_group_id          = 1000

  kafka_controllers = {
    "1" = { node_id = 1 },
    "2" = { node_id = 2 },
    "3" = { node_id = 3 },
  }

  kafka_brokers = {
    "0" = { node_id = 4 },
    "1" = { node_id = 5 },
    "2" = { node_id = 6 },
  }

  kafka_broker_pvc_storage       = "2Gi"
  kafka_controller_pvc_storage   = "1Gi"
  kafka_controller_quorum_voters = join(",", [for id, config in local.kafka_controllers : "${config.node_id}@kafka-controller-${id}:${var.controller_internal_port}"])

  PUBSUB_BROKERS = join(",", [for ordinal, config in local.kafka_brokers : "kafka-broker-${ordinal}.kafka-broker-headless.${var.namespace}.svc.cluster.local:${var.broker_internal_port}"])
}

resource "kubernetes_persistent_volume_claim" "kafka_controller_pvc" {
  for_each = local.kafka_controllers
  metadata {
    name      = "kafka-controller-${each.key}-data-pvc"
    namespace = var.namespace
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = local.kafka_controller_pvc_storage
      }
    }
  }
}

resource "kubernetes_deployment" "kafka_controller" {
  for_each = local.kafka_controllers
  metadata {
    name      = "kafka-controller-${each.key}"
    namespace = var.namespace
    labels = {
      app = "kafka-controller"
      id  = each.key
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "kafka-controller"
        id  = each.key
      }
    }
    template {
      metadata {
        labels = {
          app = "kafka-controller"
          id  = each.key
        }
      }
      spec {
        security_context {
          fs_group = local.fs_group_id
        }
        container {
          name  = "kafka-controller-${each.key}"
          image = local.kafka_image
          env {
            name  = "CLUSTER_ID"
            value = var.cluster_id
          }
          env {
            name  = "KAFKA_NUM_PARTITIONS"
            value = tostring(var.num_partitions)
          }
          env {
            name  = "KAFKA_LOG_SEGMENT_BYTES"
            value = tostring(var.log_segment_bytes)
          }
          env {
            name  = "KAFKA_NODE_ID"
            value = tostring(each.value.node_id)
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
            name  = "KAFKA_INTER_BROKER_LISTENER_NAME"
            value = "PLAINTEXT"
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
            name  = "KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS"
            value = "0"
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
            name       = "kafka-controller-${each.key}-storage"
          }
        }
        volume {
          name = "kafka-controller-${each.key}-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.kafka_controller_pvc[each.key].metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "kafka_controller_service" {
  for_each = local.kafka_controllers
  metadata {
    name      = "kafka-controller-${each.key}"
    namespace = var.namespace
  }
  spec {
    selector = {
      app = kubernetes_deployment.kafka_controller[each.key].spec[0].template[0].metadata[0].labels.app
      id  = kubernetes_deployment.kafka_controller[each.key].spec[0].template[0].metadata[0].labels.id
    }
    port {
      protocol    = "TCP"
      port        = var.controller_internal_port
      target_port = var.controller_internal_port
    }
    type = "ClusterIP"
  }
}

resource "kubernetes_stateful_set" "kafka_broker" {
  metadata {
    name      = "kafka-broker"
    namespace = var.namespace
    labels = {
      app = "kafka-broker"
    }
  }
  spec {
    replicas = length(local.kafka_brokers)
    selector {
      match_labels = {
        app = "kafka-broker"
      }
    }
    service_name = "kafka-broker-headless"
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
          env {
            name  = "CLUSTER_ID"
            value = var.cluster_id
          }
          env {
            name  = "KAFKA_NUM_PARTITIONS"
            value = tostring(var.num_partitions)
          }
          env {
            name  = "KAFKA_LOG_SEGMENT_BYTES"
            value = tostring(var.log_segment_bytes)
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
            name = "KAFKA_ADVERTISED_LISTENERS"
            value = "PLAINTEXT://$(POD_NAME).kafka-broker-headless.${var.namespace}.svc.cluster.local:${var
            .broker_internal_port}"
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
            name  = "KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS"
            value = "0"
          }
          env {
            name  = "KAFKA_LOG_DIRS"
            value = "/kafka/data"
          }
          env {
            name = "KAFKA_POD_NAME"
            value_from {
              field_ref {
                field_path = "metadata.name"
              }
            }
          }

          command = ["/bin/bash", "-c"]
          args = [
            <<EOF
          export KAFKA_NODE_ID=$(echo $KAFKA_POD_NAME | sed 's/kafka-broker-//');
          echo "KAFKA_NODE_ID: $KAFKA_NODE_ID";
          echo "CLUSTER_ID: $CLUSTER_ID";
          
          KAFKA_CONFIG_FILE="/opt/kafka/config/kraft/server.properties";
          
           if [ ! -f "$KAFKA_LOG_DIRS/meta.properties" ]; then
            /opt/kafka/bin/kafka-storage.sh format --config "$KAFKA_CONFIG_FILE" --cluster-id "$CLUSTER_ID"
            echo "Formatted..";
          else
            echo "Found meta.properties.";
          fi
          
          exec /opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/kraft/server.properties
          EOF
          ]

          port {
            container_port = var.broker_internal_port
            name           = "broker-internal"
          }

          readiness_probe {
            tcp_socket {
              port = var.broker_internal_port
            }
            initial_delay_seconds = 30
            period_seconds        = 10
            timeout_seconds       = 5
            failure_threshold     = 3
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
            storage = local.kafka_broker_pvc_storage
          }
        }
      }
    }
  }
  depends_on = [
    kubernetes_deployment.kafka_controller,
  ]
}

resource "kubernetes_service" "kafka_broker_headless_service" {
  metadata {
    name      = "kafka-broker-headless"
    namespace = var.namespace
    labels = {
      app = "kafka-broker"
    }
  }
  spec {
    cluster_ip = "None"
    selector = {
      app = kubernetes_stateful_set.kafka_broker.spec[0].template[0].metadata[0].labels.app
    }
    port {
      name        = "broker-internal"
      protocol    = "TCP"
      port        = var.broker_internal_port
      target_port = var.broker_internal_port
    }
  }
}
