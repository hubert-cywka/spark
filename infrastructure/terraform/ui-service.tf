resource "kubernetes_deployment" "ui_service" {
    metadata {
        name      = "ui-service"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        replicas = 1
        selector {
            match_labels = {
                app = "ui-service"
            }
        }

        template {
            metadata {
                labels = {
                    app = "ui-service"
                }
            }

            spec {
                container {
                    name  = "ui-service"
                    image = "hejs22/codename-ui-service:latest"

                    port {
                        container_port = var.UI_SERVICE_PORT
                    }

                    env {
                        name  = "PORT"
                        value = var.UI_SERVICE_PORT
                    }
                    env {
                        name  = "STATIC_FILES_DIR"
                        value = var.UI_SERVICE_STATIC_FILES_DIR
                    }
                }
            }
        }
    }
}

resource "kubernetes_service" "ui_service" {
    metadata {
        name      = "ui-service"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        selector = {
            app = kubernetes_deployment.ui_service.spec[0].template[0].metadata[0].labels.app
        }

        port {
            port = var.UI_SERVICE_PORT
        }

        type = "ClusterIP"
    }
}

