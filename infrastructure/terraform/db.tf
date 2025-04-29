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
