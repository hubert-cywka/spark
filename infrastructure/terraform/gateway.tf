resource "kubernetes_deployment" "gateway" {
  metadata {
    name      = "gateway"
    namespace = kubernetes_namespace.codename.metadata[0].name
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "gateway"
      }
    }

    template {
      metadata {
        labels = {
          app = "gateway"
        }
      }

      spec {
        container {
          name  = "gateway"
          image = "hejs22/codename-gateway:latest"

          liveness_probe {
            http_get {
              path = "/healthz"
              port = 9901
            }
            initial_delay_seconds = 5
            period_seconds        = 10
            timeout_seconds       = 3
            failure_threshold     = 3
          }

          readiness_probe {
            http_get {
              path = "/ready"
              port = 9901
            }
            initial_delay_seconds = 15
            period_seconds        = 5
            timeout_seconds       = 3
            failure_threshold     = 3
          }

          port {
            container_port = var.GATEWAY_PORT
          }

          env {
            name  = "BACKEND_ADDRESS"
            value = "${kubernetes_service.backend.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
          }
          env {
            name  = "BACKEND_PORT"
            value = var.BACKEND_PORT
          }
          env {
            name  = "FRONTEND_ADDRESS"
            value = "${kubernetes_service.frontend.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
          }
          env {
            name  = "FRONTEND_PORT"
            value = var.FRONTEND_PORT
          }
          env {
            name  = "ALLOWED_ORIGINS"
            value = var.GATEWAY_ALLOWED_ORIGINS
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "gateway" {
  metadata {
    name      = "gateway"
    namespace = kubernetes_namespace.codename.metadata[0].name
  }

  spec {
    selector = {
      app = kubernetes_deployment.gateway.spec[0].template[0].metadata[0].labels.app
    }

    port {
      port = var.GATEWAY_PORT
    }

    type = "ClusterIP"
  }
}
