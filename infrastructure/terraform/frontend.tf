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

          liveness_probe {
            http_get {
              path = "/"
              port = 80
            }
            initial_delay_seconds = 15
            period_seconds        = 10
            timeout_seconds       = 5
            failure_threshold     = 3
          }

          readiness_probe {
            http_get {
              path = "/"
              port = 80
            }
            initial_delay_seconds = 20
            period_seconds        = 5
            timeout_seconds       = 3
            failure_threshold     = 3
          }

          port {
            container_port = var.FRONTEND_PORT
          }

          env {
            name  = "PORT"
            value = var.FRONTEND_PORT
          }
          env {
            name  = "NEXT_PUBLIC_API_URL"
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

