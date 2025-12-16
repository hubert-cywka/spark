output "service_name" {
  value = kubernetes_service.envoy.metadata[0].name
}

output "internal_url" {
  value = "${kubernetes_deployment.envoy.metadata[0].name}.${var.namespace}.svc.cluster.local:${var.envoy_internal_port}"
}