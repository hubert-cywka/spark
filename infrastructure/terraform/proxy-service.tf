resource "kubernetes_deployment" "proxy_service" {
    metadata {
        name      = "proxy-service"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        replicas = 1
        selector {
            match_labels = {
                app = "proxy-service"
            }
        }

        template {
            metadata {
                labels = {
                    app = "proxy-service"
                }
            }

            spec {
                container {
                    name  = "proxy-service"
                    image = "hejs22/codename-proxy-service:latest"

                    port {
                        container_port = var.PROXY_SERVICE_INTERNAL_PORT
                    }

                    env {
                        name  = "AUTHENTICATION_SERVICE_ADDRESS"
                        value = var.AUTHENTICATION_SERVICE_HOST
                    }
                    env {
                        name  = "AUTHENTICATION_SERVICE_PORT"
                        value = var.AUTHENTICATION_SERVICE_INTERNAL_PORT
                    }
                    env {
                        name  = "UI_SERVICE_ADDRESS"
                        value = var.UI_SERVICE_HOST
                    }
                    env {
                        name  = "UI_SERVICE_PORT"
                        value = var.UI_SERVICE_INTERNAL_PORT
                    }
                    env {
                        name  = "STITCHING_SERVICE_ADDRESS"
                        value = var.STITCHING_SERVICE_HOST
                    }
                    env {
                        name  = "STITCHING_SERVICE_PORT"
                        value = var.STITCHING_SERVICE_INTERNAL_PORT
                    }
                    env {
                        name  = "ALLOWED_ORIGINS"
                        value = var.PROXY_SERVICE_ALLOWED_ORIGINS
                    }
                }
            }
        }
    }
}

resource "kubernetes_service" "proxy_service" {
    metadata {
        name      = "proxy-service"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        selector = {
            app = "proxy-service"
        }

        port {
            port        = var.PROXY_SERVICE_EXTERNAL_PORT
            target_port = var.PROXY_SERVICE_INTERNAL_PORT
        }

        type = "LoadBalancer"
    }
}
