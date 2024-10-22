resource "kubernetes_deployment" "users_service" {
    metadata {
        name      = "users-service"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        replicas = 1
        selector {
            match_labels = {
                app = "users-service"
            }
        }

        template {
            metadata {
                labels = {
                    app = "users-service"
                }
            }

            spec {
                container {
                    name  = "users-service"
                    image = "hejs22/codename-users-service:latest"

                    port {
                        container_port = var.USERS_SERVICE_INTERNAL_PORT
                    }

                    env {
                        name  = "PORT"
                        value = var.USERS_SERVICE_INTERNAL_PORT
                    }
                    env {
                        name  = "DATABASE_PORT"
                        value = var.DATABASE_PORT
                    }
                    env {
                        name  = "DATABASE_USERNAME"
                        value = var.DATABASE_USERNAME
                    }
                    env {
                        name  = "DATABASE_PASSWORD"
                        value = var.DATABASE_PASSWORD
                    }
                    env {
                        name  = "DATABASE_HOST"
                        value = var.DATABASE_HOST
                    }
                    env {
                        name  = "DATABASE_NAME"
                        value = var.USERS_SERVICE_DATABASE_NAME
                    }
                    env {
                        name  = "PUBSUB_HOST"
                        value = var.REDIS_HOST
                    }
                    env {
                        name  = "PUBSUB_PORT"
                        value = var.REDIS_PORT
                    }
                }
            }
        }
    }

    depends_on = [kubernetes_deployment.postgres, kubernetes_deployment.redis]
}

resource "kubernetes_service" "users_service" {
    metadata {
        name      = "users-service"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        selector = {
            app = "users-service"
        }

        port {
            port        = var.USERS_SERVICE_EXTERNAL_PORT
            target_port = var.USERS_SERVICE_INTERNAL_PORT
        }

        type = "ClusterIP"
    }
}
