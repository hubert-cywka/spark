output "deployment_name" {
  value = kubernetes_deployment.envoy.metadata[0].name
}

output "service_name" {
  value = kubernetes_service.envoy.metadata[0].name
}
