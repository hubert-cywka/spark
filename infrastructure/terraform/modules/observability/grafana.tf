resource "kubernetes_deployment" "grafana" {
  metadata {
    name      = "grafana"
    namespace = var.namespace
    labels    = { app = "grafana" }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "grafana"
      }
    }

    template {
      metadata {
        labels = {
          app = "grafana"
        }
      }

      spec {
        container {
          name  = "grafana"
          image = "grafana/grafana:${var.grafana_image_tag}"

          env {
            name  = "GF_SECURITY_ADMIN_USER"
            value = var.grafana_admin_user
          }
          env {
            name  = "GF_SECURITY_ADMIN_PASSWORD"
            value = var.grafana_admin_password
          }

          port {
            container_port = var.grafana_port
          }

          volume_mount {
            mount_path = "/var/lib/grafana"
            name       = "grafana-storage"
          }
        }
        volume {
          name = "grafana-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.grafana_pvc.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "grafana" {
  metadata {
    name      = "grafana"
    namespace = var.namespace
    labels    = { app = "grafana" }
  }

  spec {
    selector = {
      app = kubernetes_deployment.grafana.metadata[0].labels.app
    }

    port {
      port        = var.grafana_port
      target_port = 3000
      protocol    = "TCP"
      name        = "web"
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_persistent_volume_claim" "grafana_pvc" {
  metadata {
    name      = "grafana-pvc"
    namespace = var.namespace
  }

  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = var.grafana_volume_size_request
      }
    }
    storage_class_name = "standard"
  }
}