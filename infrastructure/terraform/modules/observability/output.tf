output "otel_collector_address" {
  value = "http://${kubernetes_service.otel_collector.metadata[0].name}.${var.namespace}.svc.cluster.local:${var.otel_grpc_port}"
}

output "prometheus_address" {
  value = "http://${kubernetes_service.prometheus.metadata[0].name}.${var.namespace}.svc.cluster.local:${var.prometheus_web_port}"
}