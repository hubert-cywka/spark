resource "kubernetes_deployment" "authentication_service" {
    metadata {
        name      = "authentication-service"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        replicas = 1

        selector {
            match_labels = {
                app = "authentication-service"
            }
        }

        template {
            metadata {
                labels = {
                    app = "authentication-service"
                }
            }

            spec {
                container {
                    name  = "authentication-service"
                    image = "hejs22/codename-authentication-service:latest"

                    port {
                        container_port = var.AUTHENTICATION_SERVICE_INTERNAL_PORT
                    }

                    env {
                        name  = "PORT"
                        value = var.AUTHENTICATION_SERVICE_INTERNAL_PORT
                    }
                    env {
                        name  = "JWT_SIGNING_SECRET"
                        value = var.AUTHENTICATION_SERVICE_JWT_SIGNING_SECRET
                    }
                    env {
                        name  = "JWT_EXPIRATION_TIME_IN_SECONDS"
                        value = var.AUTHENTICATION_SERVICE_JWT_EXPIRATION_TIME_IN_SECONDS
                    }
                    env {
                        name  = "REFRESH_TOKEN_SIGNING_SECRET"
                        value = var.AUTHENTICATION_SERVICE_REFRESH_TOKEN_SIGNING_SECRET
                    }
                    env {
                        name  = "REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS"
                        value = var.AUTHENTICATION_SERVICE_REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS
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
                        value = var.AUTHENTICATION_SERVICE_DATABASE_NAME
                    }
                    env {
                        name  = "THROTTLE_LIMIT"
                        value = var.AUTHENTICATION_SERVICE_THROTTLE_LIMIT
                    }
                    env {
                        name  = "THROTTLE_TTL_IN_MS"
                        value = var.AUTHENTICATION_SERVICE_THROTTLE_TTL_IN_MS
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
}

resource "kubernetes_service" "authentication_service" {
    metadata {
        name      = "authentication-service"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        selector = {
            app = "authentication-service"
        }

        port {
            port        = var.AUTHENTICATION_SERVICE_EXTERNAL_PORT
            target_port = var.AUTHENTICATION_SERVICE_INTERNAL_PORT
        }

        type = "ClusterIP"
    }
}
