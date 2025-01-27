resource "kubernetes_deployment" "gateway" {
    metadata {
        name      = "gateway"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        replicas = 1
        selector {
            match_labels = {
                app = "gateway"
            }
        }

        template {
            metadata {
                labels = {
                    app = "gateway"
                }
            }

            spec {
                container {
                    name  = "gateway"
                    image = "hejs22/codename-gateway:pr-76"
                    image_pull_policy = "Always"

                    port {
                        container_port = var.GATEWAY_PORT
                    }

                    env {
                        name  = "IDENTITY_SERVICE_ADDRESS"
                        value = "${kubernetes_service.identity-service.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
                    }
                    env {
                        name  = "IDENTITY_SERVICE_PORT"
                        value = var.BACKEND_PORT
                    }

                    env {
                        name  = "ALERT_SERVICE_ADDRESS"
                        value = "${kubernetes_service.alert-service.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
                    }
                    env {
                        name  = "ALERT_SERVICE_PORT"
                        value = var.BACKEND_PORT
                    }

                    env {
                        name  = "JOURNAL_SERVICE_ADDRESS"
                        value = "${kubernetes_service.journal-service.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
                    }
                    env {
                        name  = "JOURNAL_SERVICE_PORT"
                        value = var.BACKEND_PORT
                    }

                    env {
                        name  = "MAIL_SERVICE_ADDRESS"
                        value = "${kubernetes_service.mail-service.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
                    }
                    env {
                        name  = "MAIL_SERVICE_PORT"
                        value = var.BACKEND_PORT
                    }

                    env {
                        name  = "USER_SERVICE_ADDRESS"
                        value = "${kubernetes_service.user-service.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
                    }
                    env {
                        name  = "USER_SERVICE_PORT"
                        value = var.BACKEND_PORT
                    }

                    env {
                        name  = "FRONTEND_ADDRESS"
                        value = "${kubernetes_service.frontend.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
                    }
                    env {
                        name  = "FRONTEND_PORT"
                        value = var.FRONTEND_PORT
                    }
                    env {
                        name  = "ALLOWED_ORIGINS"
                        value = var.GATEWAY_ALLOWED_ORIGINS
                    }
                }
            }
        }
    }
}

resource "kubernetes_service" "gateway" {
    metadata {
        name      = "gateway"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        selector = {
            app = kubernetes_deployment.gateway.spec[0].template[0].metadata[0].labels.app
        }

        port {
            port      = var.GATEWAY_PORT
        }

        type = "ClusterIP"
    }
}
