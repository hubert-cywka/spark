resource "kubernetes_deployment" "postgres" {
  metadata {
    name      = "postgres"
    namespace = var.namespace
    labels    = { app = "postgres" }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "postgres"
      }
    }

    template {
      metadata {
        labels = {
          app = "postgres"
        }
      }

      spec {
        container {
          name  = "postgres"
          image = "postgres:${var.postgresql_image_tag}"

          liveness_probe {
            exec {
              command = [
                "pg_isready",
                "-U", var.database_username,
                "-d", var.database_name,
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
            exec {
              command = [
                "pg_isready",
                "-U", var.database_username,
                "-d", var.database_name,
                "-h", "localhost",
                "-p", "5432",
                "-t", "1"
              ]
            }
            initial_delay_seconds = 20
            period_seconds        = 15
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3
          }

          port {
            container_port = 5432
          }

          env {
            name  = "POSTGRES_USER"
            value = var.database_username
          }
          env {
            name  = "POSTGRES_PASSWORD"
            value = var.database_password
          }
          env {
            name  = "POSTGRES_DB"
            value = var.database_name
          }
          volume_mount {
            mount_path = "/var/lib/postgresql/data"
            name       = "postgres-storage"
          }
        }
        volume {
          name = "postgres-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.postgres_pvc.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_persistent_volume_claim" "postgres_pvc" {
  metadata {
    name      = "postgres-pvc"
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

resource "kubernetes_service" "postgres" {
  metadata {
    name      = "postgres"
    namespace = var.namespace
    labels    = { app = "postgres" }
  }

  spec {
    selector = {
      app = kubernetes_deployment.postgres.spec[0].template[0].metadata[0].labels.app
    }

    port {
      port        = 5432
      target_port = 5432
      protocol    = "TCP"
      name        = "postgresql"
    }

    type = "ClusterIP"
  }
}

