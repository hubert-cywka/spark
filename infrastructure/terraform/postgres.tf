resource "kubernetes_deployment" "postgres" {
    metadata {
        name      = "postgres"
        namespace = kubernetes_namespace.codename.metadata[0].name
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
                    image = "postgres"
                    port {
                        container_port = var.DATABASE_PORT
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
                        value = "db" // TODO
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

resource "kubernetes_service" "postgres" {
    metadata {
        name      = "postgres"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        selector = {
            app = kubernetes_deployment.postgres.spec[0].template[0].metadata[0].labels.app
        }

        port {
            port        = var.DATABASE_PORT
            target_port = var.DATABASE_PORT
        }

        type = "ClusterIP"
    }
}
