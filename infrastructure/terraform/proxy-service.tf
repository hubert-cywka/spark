resource "kubernetes_deployment" "proxy_service" {
    metadata {
        name      = "proxy-service"
        namespace = kubernetes_namespace.codename.metadata[0].name
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
                        container_port = var.PROXY_SERVICE_PORT
                    }

                    env {
                        name  = "AUTHENTICATION_SERVICE_ADDRESS"
                        value = "${kubernetes_service.authentication_service.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
                    }
                    env {
                        name  = "AUTHENTICATION_SERVICE_PORT"
                        value = var.AUTHENTICATION_SERVICE_PORT
                    }
                    env {
                        name  = "UI_SERVICE_ADDRESS"
                        value = "${kubernetes_service.ui_service.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
                    }
                    env {
                        name  = "UI_SERVICE_PORT"
                        value = var.UI_SERVICE_PORT
                    }
                    env {
                        name  = "STITCHING_SERVICE_ADDRESS"
                        value = "${kubernetes_service.stitching_service.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
                    }
                    env {
                        name  = "STITCHING_SERVICE_PORT"
                        value = var.STITCHING_SERVICE_PORT
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
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        selector = {
            app = kubernetes_deployment.proxy_service.spec[0].template[0].metadata[0].labels.app
        }

        port {
            port      = var.PROXY_SERVICE_PORT
        }

        type = "ClusterIP"
    }
}
