resource "kubernetes_persistent_volume" "postgres_volume" {
    metadata {
        name = "postgres-volume"
    }

    spec {
        capacity = {
            storage = "2Gi"
        }
        access_modes = ["ReadWriteOnce"]

        persistent_volume_source {
            host_path {
                path = "/mnt/data/postgres"
            }
        }
    }
}

resource "kubernetes_persistent_volume_claim" "postgres_pvc" {
    metadata {
        name      = "postgres-pvc"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        access_modes = ["ReadWriteOnce"]
        resources {
            requests = {
                storage = "2Gi"
            }
        }
    }
}

resource "kubernetes_persistent_volume" "redis_volume" {
    metadata {
        name = "redis-volume"
    }

    spec {
        capacity = {
            storage = "1Gi"
        }
        access_modes = ["ReadWriteOnce"]

        persistent_volume_source {
            host_path {
                path = "/mnt/data/redis"
            }
        }
    }
}

resource "kubernetes_persistent_volume_claim" "redis_pvc" {
    metadata {
        name      = "redis-pvc"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        access_modes = ["ReadWriteOnce"]
        resources {
            requests = {
                storage = "1Gi"
            }
        }
    }
}
