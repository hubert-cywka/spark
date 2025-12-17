output "service_name" {
  value = kubernetes_service_v1.envoy.metadata[0].name
}

output "internal_url" {
  value = "${kubernetes_deployment_v1.envoy.metadata[0].name}.${var.namespace}.svc.cluster.local:${var.envoy_internal_port}"
}