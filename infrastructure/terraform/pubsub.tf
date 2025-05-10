resource "kubernetes_deployment" "pubsub" {
  metadata {
    name      = "pubsub"
    namespace = kubernetes_namespace.codename.metadata[0].name
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "pubsub"
      }
    }

    template {
      metadata {
        labels = {
          app = "pubsub"
        }
      }

      spec {
        container {
          name  = "pubsub"
          image = "nats:2.10.24-alpine3.21"
          args  = ["-js", "-m", "8222"]

          liveness_probe {
            http_get {
              path = "/healthz"
              port = 8222
            }
            initial_delay_seconds = 10
            period_seconds        = 10
            timeout_seconds       = 5
            failure_threshold     = 3
          }

          readiness_probe {
            tcp_socket {
              port = 4222
            }
            initial_delay_seconds = 5
            period_seconds        = 5
            timeout_seconds       = 3
            failure_threshold     = 3
          }

          port {
            container_port = var.PUBSUB_PORT
          }

          volume_mount {
            mount_path = "/data"
            name       = "pubsub-storage"
          }
        }
        volume {
          name = "pubsub-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.pubsub_pvc.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "pubsub" {
  metadata {
    name      = "pubsub"
    namespace = kubernetes_namespace.codename.metadata[0].name
  }

  spec {
    selector = {
      app = kubernetes_deployment.pubsub.spec[0].template[0].metadata[0].labels.app
    }

    port {
      port = var.PUBSUB_PORT
    }

    type = "ClusterIP"
  }
}
