terraform {
  required_providers {
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.14.0"
    }
  }
}

resource "kubectl_manifest" "keda_scaled_object" {
  count = length(var.keda_prometheus_trigger) > 0 ? 1 : 0

  yaml_body = yamlencode({
    apiVersion = "keda.sh/v1alpha1"
    kind       = "ScaledObject"
    metadata = {
      name      = "${var.service_name}-keda-scaler"
      namespace = var.namespace
      labels = {
        app_project = "codename"
      }
    }
    spec = {
      scaleTargetRef = {
        name = kubernetes_deployment_v1.this.metadata[0].name
      }
      minReplicaCount = var.min_replicas
      max_replicas    = var.max_replicas
      pollingInterval = 15
      cooldownPeriod  = 300
      triggers = [
        {
          type = "prometheus"
          metadata = {
            "serverAddress" = var.keda_prometheus_trigger[0].server_address
            "metricName"    = var.keda_prometheus_trigger[0].metric_name
            "query"         = var.keda_prometheus_trigger[0].query
            "threshold"     = var.keda_prometheus_trigger[0].threshold
          }
        }
      ]
    }
  })
}