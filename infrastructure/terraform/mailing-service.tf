resource "kubernetes_deployment" "mailing_service" {
    metadata {
        name      = "mailing-service"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        replicas = 1
        selector {
            match_labels = {
                app = "mailing-service"
            }
        }

        template {
            metadata {
                labels = {
                    app = "mailing-service"
                }
            }

            spec {
                container {
                    name  = "mailing-service"
                    image = "hejs22/codename-mailing-service:latest"

                    port {
                        container_port = var.MAILING_SERVICE_INTERNAL_PORT
                    }

                    env {
                        name  = "PORT"
                        value = var.USERS_SERVICE_INTERNAL_PORT
                    }
                    env {
                        name  = "PUBSUB_HOST"
                        value = var.REDIS_HOST
                    }
                    env {
                        name  = "PUBSUB_PORT"
                        value = var.REDIS_PORT
                    }
                    env {
                        name  = "APP_URL"
                        value = var.APP_URL
                    }
                    env {
                        name  = "SENDER_NAME"
                        value = var.MAILING_SERVICE_SENDER_NAME
                    }
                    env {
                        name  = "SENDER_USER"
                        value = var.MAILING_SERVICE_SENDER_USER
                    }
                    env {
                        name  = "SENDER_PASSWORD"
                        value = var.MAILING_SERVICE_SENDER_PASSWORD
                    }
                    env {
                        name  = "SENDER_HOST"
                        value = var.MAILING_SERVICE_SENDER_HOST
                    }
                    env {
                        name  = "SENDER_PORT"
                        value = var.MAILING_SERVICE_SENDER_PORT
                    }
                    env {
                        name  = "DEBUG_MODE"
                        value = var.MAILING_SERVICE_DEBUG_MODE
                    }
                }
            }
        }
    }
}

resource "kubernetes_service" "mailing_service" {
    metadata {
        name      = "mailing-service"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        selector = {
            app = "mailing-service"
        }

        port {
            port        = var.MAILING_SERVICE_EXTERNAL_PORT
            target_port = var.MAILING_SERVICE_INTERNAL_PORT
        }

        type = "ClusterIP"
    }
}
