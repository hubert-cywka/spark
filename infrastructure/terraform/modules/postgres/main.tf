resource "kubernetes_deployment" "db" {
  metadata {
    name      = "db"
    namespace = var.namespace
    labels    = { app = "db" }
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

resource "kubernetes_persistent_volume_claim" "db_pvc" {
  metadata {
    name      = "db-pvc"
    namespace = var.namespace
  }

  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "2Gi"
      }
    }
    storage_class_name = "standard"
  }
}

resource "kubernetes_service" "db" {
  metadata {
    name      = "db"
    namespace = var.namespace
    labels    = { app = "db" }
  }

  spec {
    selector = {
      app = kubernetes_deployment.db.spec[0].template[0].metadata[0].labels.app
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

resource "kubernetes_deployment" "pooler" {
  metadata {
    name      = "pooler"
    namespace = var.namespace
    labels    = { app = "pooler" }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "pooler"
      }
    }

    template {
      metadata {
        labels = {
          app = "pooler"
        }
      }

      spec {
        container {
          name  = "pooler"
          image = "bitnami/pgbouncer:${var.pgbouncer_image_tag}"

          liveness_probe {
            tcp_socket {
              port = var.database_port
            }
            initial_delay_seconds = 15
            period_seconds        = 20
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3
          }

          readiness_probe {
            tcp_socket {
              port = var.database_port
            }
            initial_delay_seconds = 20
            period_seconds        = 15
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3
          }

          port {
            container_port = var.database_port
          }

          env {
            name  = "PGBOUNCER_POOL_MODE"
            value = var.pgbouncer_pool_mode
          }
          env {
            name  = "PGBOUNCER_QUERY_WAIT_TIMEOUT"
            value = var.pgbouncer_query_wait_timeout
          }
          env {
            name  = "PGBOUNCER_MAX_CLIENT_CONN"
            value = var.pgbouncer_max_client_conn
          }
          env {
            name  = "PGBOUNCER_DEFAULT_POOL_SIZE"
            value = var.pgbouncer_default_pool_size
          }
          env {
            name  = "PGBOUNCER_STATS_USERS"
            value = var.pgbouncer_stats_users
          }
          env {
            name  = "POSTGRESQL_USERNAME"
            value = var.database_username
          }
          env {
            name  = "POSTGRESQL_PASSWORD"
            value = var.database_password
          }
          env {
            name  = "PGBOUNCER_DATABASE"
            value = var.database_name
          }
          env {
            name  = "POSTGRESQL_HOST"
            value = kubernetes_service.db.metadata[0].name
          }
          env {
            name  = "POSTGRESQL_PORT"
            value = 5432
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "pooler" {
  metadata {
    name      = "pooler"
    namespace = var.namespace
    labels    = { app = "pooler" }
  }

  spec {
    selector = {
      app = kubernetes_deployment.pooler.spec[0].template[0].metadata[0].labels.app
    }

    port {
      port        = var.database_port
      target_port = var.database_port
      protocol    = "TCP"
      name        = "pgbouncer"
    }

    type = "ClusterIP"
  }
}
