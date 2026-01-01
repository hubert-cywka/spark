resource "kubernetes_deployment_v1" "envoy" {
  metadata {
    name      = "envoy"
    namespace = var.namespace
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
            name           = "public-port"
            container_port = var.envoy_port
          }

          port {
            name           = "internal-port"
            container_port = var.envoy_internal_port
          }

          liveness_probe {
            http_get {
              path = "/ready"
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

          env {
            name  = "IDENTITY_SERVICE_ADDRESS"
            value = "${var.identity_service_name}.${var.namespace}.svc.cluster.local"
          }
          env {
            name  = "IDENTITY_SERVICE_PORT"
            value = var.backend_port
          }

          env {
            name  = "JOURNAL_SERVICE_ADDRESS"
            value = "${var.journal_service_name}.${var.namespace}.svc.cluster.local"
          }
          env {
            name  = "JOURNAL_SERVICE_PORT"
            value = var.backend_port
          }

          env {
            name  = "USERS_SERVICE_ADDRESS"
            value = "${var.users_service_name}.${var.namespace}.svc.cluster.local"
          }
          env {
            name  = "USERS_SERVICE_PORT"
            value = var.backend_port
          }

          env {
            name  = "PRIVACY_SERVICE_ADDRESS"
            value = "${var.privacy_service_name}.${var.namespace}.svc.cluster.local"
          }
          env {
            name  = "PRIVACY_SERVICE_PORT"
            value = var.backend_port
          }

          env {
            name  = "EXPORTS_SERVICE_ADDRESS"
            value = "${var.exports_service_name}.${var.namespace}.svc.cluster.local"
          }
          env {
            name  = "EXPORTS_SERVICE_PORT"
            value = var.backend_port
          }

          env {
            name  = "SCHEDULING_SERVICE_ADDRESS"
            value = "${var.scheduling_service_name}.${var.namespace}.svc.cluster.local"
          }
          env {
            name  = "SCHEDULING_SERVICE_PORT"
            value = var.backend_port
          }

          env {
            name  = "CONFIGURATION_SERVICE_ADDRESS"
            value = "${var.configuration_service_name}.${var.namespace}.svc.cluster.local"
          }
          env {
            name  = "CONFIGURATION_SERVICE_PORT"
            value = var.backend_port
          }

          env {
            name  = "MAIL_SERVICE_ADDRESS"
            value = "${var.mail_service_name}.${var.namespace}.svc.cluster.local"
          }
          env {
            name  = "MAIL_SERVICE_PORT"
            value = var.backend_port
          }

          env {
            name  = "ALERTS_SERVICE_ADDRESS"
            value = "${var.alerts_service_name}.${var.namespace}.svc.cluster.local"
          }
          env {
            name  = "ALERTS_SERVICE_PORT"
            value = var.backend_port
          }

          env {
            name  = "FRONTEND_ADDRESS"
            value = "${var.frontend_service_name}.${var.namespace}.svc.cluster.local"
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

resource "kubernetes_service_v1" "envoy" {
  metadata {
    name      = "envoy"
    namespace = var.namespace
  }

  spec {
    selector = {
      app = kubernetes_deployment_v1.envoy.spec[0].template[0].metadata[0].labels.app
    }

    port {
      name = "public-port"
      port = var.envoy_port
    }

    port {
      name = "internal-port"
      port = var.envoy_internal_port
    }

    type = "ClusterIP"
  }
}
