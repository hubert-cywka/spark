resource "kubernetes_deployment" "ui_service" {
    metadata {
        name      = "ui-service"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
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
                        container_port = var.UI_SERVICE_INTERNAL_PORT
                    }

                    env {
                        name  = "PORT"
                        value = var.UI_SERVICE_INTERNAL_PORT
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
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        selector = {
            app = "ui-service"
        }

        port {
            port        = var.UI_SERVICE_EXTERNAL_PORT
            target_port = var.UI_SERVICE_INTERNAL_PORT
        }

        type = "ClusterIP"
    }
}

