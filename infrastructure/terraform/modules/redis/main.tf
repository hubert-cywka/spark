resource "kubernetes_deployment" "redis" {
  metadata {
    name      = "redis"
    namespace = var.namespace
    labels    = { app = "redis" }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "redis"
      }
    }

    template {
      metadata {
        labels = {
          app = "redis"
        }
      }

      spec {
        container {
          name  = "redis"
          image = "redis:${var.redis_image_tag}"

          liveness_probe {
            tcp_socket {
              port = var.redis_port
            }
            initial_delay_seconds = 15
            period_seconds        = 20
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3
          }

          readiness_probe {
            tcp_socket {
              port = var.redis_port
            }
            initial_delay_seconds = 20
            period_seconds        = 15
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3
          }

          port {
            container_port = var.redis_port
          }

          volume_mount {
            mount_path = "/data"
            name       = "redis-storage"
          }
        }
        volume {
          name = "redis-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.redis_pvc.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_persistent_volume_claim" "redis_pvc" {
  metadata {
    name      = "redis-pvc"
    namespace = var.namespace
  }

  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = var.volume_size_request
      }
    }
    storage_class_name = "standard"
  }
}

resource "kubernetes_service" "redis" {
  metadata {
    name      = "redis"
    namespace = var.namespace
    labels    = { app = "redis" }
  }

  spec {
    selector = {
      app = kubernetes_deployment.redis.spec[0].template[0].metadata[0].labels.app
    }

    port {
      port        = var.redis_port
      target_port = var.redis_port
      protocol    = "TCP"
      name        = "redis"
    }

    type = "ClusterIP"
  }
}