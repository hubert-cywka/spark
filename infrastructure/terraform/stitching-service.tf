resource "kubernetes_deployment" "stitching_service" {
    metadata {
        name      = "stitching-service"
        namespace = kubernetes_namespace.codename.metadata[0].name
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
                        container_port = var.STITCHING_SERVICE_PORT
                    }

                    env {
                        name  = "PORT"
                        value = var.STITCHING_SERVICE_PORT
                    }
                    env {
                        name  = "USERS_SERVICE_SUBGRAPH_HOST"
                        value = "${kubernetes_service.users_service.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
                    }
                }
            }
        }
    }
    depends_on = [kubernetes_deployment.users_service]
}

resource "kubernetes_service" "stitching_service" {
    metadata {
        name      = "stitching-service"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        selector = {
            app = kubernetes_deployment.stitching_service.spec[0].template[0].metadata[0].labels.app
        }

        port {
            port = var.STITCHING_SERVICE_PORT
        }

        type = "ClusterIP"
    }
}
