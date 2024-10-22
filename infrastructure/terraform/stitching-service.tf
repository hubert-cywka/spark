resource "kubernetes_deployment" "stitching_service" {
    metadata {
        name      = "stitching-service"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        replicas = 1
        selector {
            match_labels = {
                app = "stitching-service"
            }
        }

        template {
            metadata {
                labels = {
                    app = "stitching-service"
                }
            }

            spec {
                container {
                    name  = "stitching-service"
                    image = "hejs22/codename-stitching-service:latest"

                    port {
                        container_port = var.STITCHING_SERVICE_INTERNAL_PORT
                    }

                    env {
                        name  = "PORT"
                        value = var.STITCHING_SERVICE_INTERNAL_PORT
                    }
                    env {
                        name  = "USERS_SERVICE_SUBGRAPH_HOST"
                        value = var.USERS_SERVICE_HOST
                    }
                }
            }
        }
    }
}

resource "kubernetes_service" "stitching_service" {
    metadata {
        name      = "stitching-service"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        selector = {
            app = "stitching-service"
        }

        port {
            port        = var.STITCHING_SERVICE_EXTERNAL_PORT
            target_port = var.STITCHING_SERVICE_INTERNAL_PORT
        }

        type = "ClusterIP"
    }
}
