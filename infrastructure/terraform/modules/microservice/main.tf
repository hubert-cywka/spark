resource "kubernetes_deployment" "this" {
  metadata {
    name      = var.service_name
    namespace = var.namespace

    labels = {
      app_project = "codename"
      app         = var.service_name
    }
  }

  spec {
    replicas = var.replicas

    strategy {
      type = "RollingUpdate"

      rolling_update {
        max_surge       = "25%"
        max_unavailable = "0"
      }
    }

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

          dynamic "liveness_probe" {
            for_each = var.enable_liveness_probe ? [1] : []
            content {
              http_get {
                path = var.liveness_path
                port = var.container_port
              }
              initial_delay_seconds = var.liveness_initial_delay_seconds
              period_seconds        = var.liveness_period_seconds
              timeout_seconds       = var.liveness_timeout_seconds
              success_threshold     = var.liveness_success_threshold
              failure_threshold     = var.liveness_failure_threshold
            }
          }

          dynamic "readiness_probe" {
            for_each = var.enable_readiness_probe ? [1] : []
            content {
              http_get {
                path = var.readiness_path
                port = var.container_port
              }
              initial_delay_seconds = var.readiness_initial_delay_seconds
              period_seconds        = var.readiness_period_seconds
              timeout_seconds       = var.readiness_timeout_seconds
              success_threshold     = var.readiness_success_threshold
              failure_threshold     = var.readiness_failure_threshold
            }
          }

          dynamic "startup_probe" {
            for_each = var.enable_startup_probe ? [1] : []
            content {
              http_get {
                path = var.startup_path
                port = var.container_port
              }
              initial_delay_seconds = var.startup_initial_delay_seconds
              period_seconds        = var.startup_period_seconds
              timeout_seconds       = var.startup_timeout_seconds
              success_threshold     = var.startup_success_threshold
              failure_threshold     = var.startup_failure_threshold
            }
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

          env_from {
            secret_ref {
              name = var.secret_name
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_manifest" "keda_scaled_object" {
  count = length(var.keda_prometheus_trigger) > 0 ? 1 : 0

  manifest = {
    "apiVersion" = "keda.sh/v1alpha1"
    "kind"       = "ScaledObject"
    "metadata" = {
      "name"      = "${var.service_name}-keda-scaler"
      "namespace" = var.namespace
      "labels" = {
        "app_project" = "codename"
      }
    }
    "spec" = {
      "scaleTargetRef" = {
        "name" = kubernetes_deployment.this.metadata[0].name
      }
      "minReplicaCount" = var.min_replicas
      "maxReplicaCount" = var.max_replicas
      "pollingInterval" = 15
      "cooldownPeriod"  = 300
      "triggers" = [
        {
          "type" = "prometheus"
          "metadata" = {
            "serverAddress" = var.keda_prometheus_trigger[0].server_address
            "metricName"    = var.keda_prometheus_trigger[0].metric_name
            "query"         = var.keda_prometheus_trigger[0].query
            "threshold"     = var.keda_prometheus_trigger[0].threshold
          }
        }
      ]
    }
  }
}

resource "kubernetes_service" "this" {
  metadata {
    name      = var.service_name
    namespace = var.namespace
    labels = {
      app_project = "codename"
      app         = var.service_name
    }
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
