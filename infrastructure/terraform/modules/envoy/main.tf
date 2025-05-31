resource "kubernetes_deployment" "envoy" {
  metadata {
    name      = "envoy"
    namespace = var.namespace_name
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "envoy"
      }
    }

    template {
      metadata {
        labels = {
          app = "envoy"
        }
      }

      spec {
        container {
          name  = "envoy"
          image = var.envoy_image

          port {
            container_port = var.envoy_port
          }

          env {
            name  = "IDENTITY_SERVICE_ADDRESS"
            value = "${var.identity_service_name}.${var.namespace_name}.svc.cluster.local"
          }
          env {
            name  = "IDENTITY_SERVICE_PORT"
            value = var.backend_port
          }

          env {
            name  = "JOURNAL_SERVICE_ADDRESS"
            value = "${var.journal_service_name}.${var.namespace_name}.svc.cluster.local"
          }
          env {
            name  = "JOURNAL_SERVICE_PORT"
            value = var.backend_port
          }

          env {
            name  = "USERS_SERVICE_ADDRESS"
            value = "${var.users_service_name}.${var.namespace_name}.svc.cluster.local"
          }
          env {
            name  = "USERS_SERVICE_PORT"
            value = var.backend_port
          }

          env {
            name  = "ALERTS_SERVICE_ADDRESS"
            value = "${var.alerts_service_name}.${var.namespace_name}.svc.cluster.local"
          }
          env {
            name  = "ALERTS_SERVICE_PORT"
            value = var.backend_port
          }

          env {
            name  = "FRONTEND_ADDRESS"
            value = "${var.frontend_service_name}.${var.namespace_name}.svc.cluster.local"
          }
          env {
            name  = "FRONTEND_PORT"
            value = var.frontend_port
          }
          env {
            name  = "ALLOWED_ORIGINS"
            value = var.allowed_origins
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "envoy" {
  metadata {
    name      = "envoy"
    namespace = var.namespace_name
  }

  spec {
    selector = {
      app = kubernetes_deployment.envoy.spec[0].template[0].metadata[0].labels.app
    }

    port {
      port = var.envoy_port
    }

    type = "ClusterIP"
  }
}
