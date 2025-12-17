resource "kubernetes_namespace_v1" "observability" {
  metadata {
    name = "observability"
  }
}

module "observability" {
  source = "./modules/observability"

  namespace                      = kubernetes_namespace_v1.observability.metadata[0].name
  grafana_volume_size_request    = "1Gi"
  tempo_volume_size_request      = "2Gi"
  prometheus_volume_size_request = "2Gi"

  otel_collector_image_tag = "latest"
  prometheus_image_tag     = "latest"
  tempo_image_tag          = "latest"
  grafana_image_tag        = "latest"
}