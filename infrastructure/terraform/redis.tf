resource "kubernetes_deployment" "redis" {
    metadata {
        name      = "redis"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        replicas = 1
        selector {
            match_labels = {
                app = "redis"
            }
        }

        template {
            metadata {
                labels = {
                    app = "redis"
                }
            }

            spec {
                container {
                    name  = "redis"
                    image = "redis:6.2-alpine"
                    port {
                        container_port = var.REDIS_PORT
                    }
                    volume_mount {
                        mount_path = "/data"
                        name       = "redis-storage"
                    }
                }
                volume {
                    name = "redis-storage"
                    persistent_volume_claim {
                        claim_name = kubernetes_persistent_volume_claim.redis_pvc.metadata[0].name
                    }
                }
            }
        }
    }
}

resource "kubernetes_service" "redis" {
    metadata {
        name      = "redis"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        selector = {
            app = "redis"
        }

        port {
            port        = var.REDIS_PORT
            target_port = var.REDIS_PORT
        }

        type = "ClusterIP"
    }
}
