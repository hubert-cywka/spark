resource "kubernetes_deployment" "this" {
  metadata {
    name      = var.service_name
    namespace = var.namespace
    labels    = { app_project = "codename" }
  }

  spec {
    replicas = var.replicas

    selector {
      match_labels = {
        app = var.service_name
      }
    }

    template {
      metadata {
        labels = {
          app = var.service_name
        }
      }

      spec {
        container {
          name  = var.service_name
          image = var.image

          liveness_probe {
            http_get {
              path = "/api/healthz/liveness"
              port = var.container_port
            }
            initial_delay_seconds = 15
            period_seconds        = 20
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3
          }

          readiness_probe {
            http_get {
              path = "/api/healthz/readiness"
              port = var.container_port
            }
            initial_delay_seconds = 20
            period_seconds        = 15
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3
          }

          startup_probe {
            http_get {
              path = "/api/healthz/startup"
              port = var.container_port
            }
            initial_delay_seconds = 0
            period_seconds        = 10
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 15
          }


          port {
            container_port = var.container_port
            name           = "http"
          }

          dynamic "env" {
            for_each = var.env_vars
            content {
              name  = env.key
              value = env.value
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "this" {
  metadata {
    name      = var.service_name
    namespace = var.namespace
    labels    = { app_project = "codename" }
  }

  spec {
    selector = {
      app = kubernetes_deployment.this.spec[0].template[0].metadata[0].labels.app
    }

    port {
      port        = var.service_port
      target_port = var.container_port
      protocol    = "TCP"
      name        = "http"
    }

    type = "ClusterIP"
  }
}
