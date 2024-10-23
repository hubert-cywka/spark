resource "kubernetes_deployment" "mailing_service" {
    metadata {
        name      = "mailing-service"
        namespace = kubernetes_namespace.codename.metadata[0].name
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
                        container_port = var.MAILING_SERVICE_PORT
                    }

                    env {
                        name  = "PORT"
                        value = var.MAILING_SERVICE_PORT
                    }
                    env {
                        name  = "PUBSUB_HOST"
                        value = "${kubernetes_service.redis.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
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
    depends_on = [kubernetes_deployment.redis]
}

resource "kubernetes_service" "mailing_service" {
    metadata {
        name      = "mailing-service"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        selector = {
            app = kubernetes_deployment.mailing_service.spec[0].template[0].metadata[0].labels.app
        }

        port {
            port = var.MAILING_SERVICE_PORT
        }

        type = "ClusterIP"
    }
}
