resource "kubernetes_deployment" "frontend" {
    metadata {
        name      = "frontend"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        replicas = 1
        selector {
            match_labels = {
                app = "frontend"
            }
        }

        template {
            metadata {
                labels = {
                    app = "frontend"
                }
            }

            spec {
                container {
                    name  = "frontend"
                    image = "hejs22/codename-frontend:latest"

                    port {
                        container_port = var.FRONTEND_PORT
                    }

                    env {
                        name  = "PORT"
                        value = var.FRONTEND_PORT
                    }
                    env {
                        name  = "API_URL"
                        value = var.GATEWAY_URL
                    }
                }
            }
        }
    }
}

resource "kubernetes_service" "frontend" {
    metadata {
        name      = "frontend"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        selector = {
            app = kubernetes_deployment.frontend.spec[0].template[0].metadata[0].labels.app
        }

        port {
            port = var.FRONTEND_PORT
        }

        type = "ClusterIP"
    }
}

