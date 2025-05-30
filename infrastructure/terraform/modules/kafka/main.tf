resource "kubernetes_stateful_set" "kafka_broker" {
  metadata {
    name      = "kafka-broker"
    namespace = kubernetes_namespace.kafka_namespace.metadata[0].name
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
            name = "KAFKA_NODE_ID"
            # Poprawka: Użyj 'lookup' i 'split' aby uzyskać ordinal z POD_NAME
            # a następnie użyj go do odwołania się do odpowiedniego node_id z local.kafka_brokers
            value = tostring(lookup(local.kafka_brokers, split("-", kubernetes_stateful_set.kafka_broker.metadata[0].name)[length(split("-", kubernetes_stateful_set.kafka_broker.metadata[0].name)) - 1], "0").node_id)
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
            name  = "KAFKA_ADVERTISED_LISTENERS"
            value = "PLAINTEXT://$(POD_NAME).kafka-broker-headless.${local.kafka_namespace_name}.svc.cluster.local:${var.broker_internal_port}"
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
            name = "POD_NAME"
            value_from {
              field_ref {
                field_path = "metadata.name"
              }
            }
          }
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
