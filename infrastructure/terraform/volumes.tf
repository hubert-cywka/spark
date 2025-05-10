resource "kubernetes_persistent_volume" "db_volume" {
  metadata {
    name = "db-volume"
  }

  spec {
    capacity = {
      storage = "2Gi"
    }
    access_modes = ["ReadWriteOnce"]

    persistent_volume_source {
      host_path {
        path = "/mnt/data/db"
      }
    }
  }
}

resource "kubernetes_persistent_volume_claim" "db_pvc" {
  metadata {
    name      = "db-pvc"
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

resource "kubernetes_persistent_volume" "pubsub_volume" {
  metadata {
    name = "pubsub-volume"
  }

  spec {
    capacity = {
      storage = "0.25Gi"
    }
    access_modes = ["ReadWriteOnce"]

    persistent_volume_source {
      host_path {
        path = "/mnt/data/pubsub"
      }
    }
  }
}

resource "kubernetes_persistent_volume_claim" "pubsub_pvc" {
  metadata {
    name      = "pubsub-pvc"
    namespace = kubernetes_namespace.codename.metadata[0].name
  }

  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "0.25Gi"
      }
    }
  }
}
