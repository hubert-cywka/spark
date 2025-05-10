resource "kubernetes_deployment" "db" {
  metadata {
    name      = "db"
    namespace = kubernetes_namespace.codename.metadata[0].name
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "db"
      }
    }

    template {
      metadata {
        labels = {
          app = "db"
        }
      }

      spec {
        container {
          name  = "db"
          image = "postgres:17.0"

          liveness_probe {
            exec {
              command = [
                "pg_isready",
                "-h", "localhost",
                "-p", "5432",
                "-t", "1"
              ]
            }

            initial_delay_seconds = 15
            period_seconds        = 20
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3
          }

          readiness_probe {
            tcp_socket {
              port = 6432
            }

            initial_delay_seconds = 20
            period_seconds        = 15
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3
          }

          port {
            container_port = var.POSTGRESQL_PORT
          }

          env {
            name  = "POSTGRES_USER"
            value = var.DATABASE_USERNAME
          }
          env {
            name  = "POSTGRES_PASSWORD"
            value = var.DATABASE_PASSWORD
          }
          env {
            name  = "POSTGRES_DB"
            value = "db"
          }
          volume_mount {
            mount_path = "/var/lib/postgresql/data"
            name       = "db-storage"
          }
        }
        volume {
          name = "db-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.db_pvc.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "db" {
  metadata {
    name      = "db"
    namespace = kubernetes_namespace.codename.metadata[0].name
  }

  spec {
    selector = {
      app = kubernetes_deployment.db.spec[0].template[0].metadata[0].labels.app
    }

    port {
      port        = var.POSTGRESQL_PORT
      target_port = var.POSTGRESQL_PORT
    }

    type = "ClusterIP"
  }
}
