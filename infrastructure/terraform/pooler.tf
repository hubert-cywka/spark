resource "kubernetes_deployment" "pooler" {
    metadata {
        name      = "pooler"
        namespace = kubernetes_namespace.codename.metadata[0].name
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
                    image = "bitnami/pgbouncer:1.24.1"
                    port {
                        container_port = var.DATABASE_PORT
                    }
                    env {
                        name  = "PGBOUNCER_POOL_MODE"
                        value = var.PGBOUNCER_POOL_MODE
                    }
                    env {
                        name  = "PGBOUNCER_QUERY_WAIT_TIMEOUT"
                        value = var.PGBOUNCER_QUERY_WAIT_TIMEOUT
                    }
                    env {
                        name  = "PGBOUNCER_MAX_CLIENT_CONN"
                        value = var.PGBOUNCER_MAX_CLIENT_CONN
                    }
                    env {
                        name  = "PGBOUNCER_DEFAULT_POOL_SIZE"
                        value = var.PGBOUNCER_DEFAULT_POOL_SIZE
                    }
                    env {
                        name  = "PGBOUNCER_STATS_USERS"
                        value = var.PGBOUNCER_STATS_USERS
                    }
                    env {
                        name  = "POSTGRESQL_USERNAME"
                        value = var.DATABASE_USERNAME
                    }
                    env {
                        name  = "POSTGRESQL_PASSWORD"
                        value = var.DATABASE_PASSWORD
                    }
                    env {
                        name  = "PGBOUNCER_DATABASE"
                        value = var.PGBOUNCER_DATABASE
                    }
                    env {
                        name  = "POSTGRESQL_HOST"
                        value = "${kubernetes_service.db.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
                    }
                    env {
                        name  = "POSTGRESQL_PORT"
                        value = var.POSTGRESQL_PORT
                    }
                }
            }
        }
    }
    depends_on = [kubernetes_deployment.db]
}

resource "kubernetes_service" "pooler" {
    metadata {
        name      = "pooler"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        selector = {
            app = kubernetes_deployment.pooler.spec[0].template[0].metadata[0].labels.app
        }

        port {
            port        = var.DATABASE_PORT
            target_port = var.DATABASE_PORT
        }

        type = "ClusterIP"
    }
}
