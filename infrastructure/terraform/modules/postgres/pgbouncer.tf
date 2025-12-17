resource "kubernetes_deployment_v1" "pooler" {
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
          image = "bitnamilegacy/pgbouncer:${var.pgbouncer_image_tag}"

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
            value = var.pgbouncer_database
          }
          env {
            name  = "POSTGRESQL_HOST"
            value = kubernetes_service_v1.postgres.metadata[0].name
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

resource "kubernetes_service_v1" "pooler" {
  metadata {
    name      = "pooler"
    namespace = var.namespace
    labels    = { app = "pooler" }
  }

  spec {
    selector = {
      app = kubernetes_deployment_v1.pooler.spec[0].template[0].metadata[0].labels.app
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
