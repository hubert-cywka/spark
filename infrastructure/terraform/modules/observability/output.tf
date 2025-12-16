output "namespace" {
  value = var.namespace
}

output "otel_collector_name" {
  value = kubernetes_service.otel_collector.metadata[0].name
}

output "otel_collector_grpc_port" {
  value = kubernetes_service.otel_collector.spec[0].port[0].port
}
