output "deployment_name" {
  value = kubernetes_deployment.gateway.metadata[0].name
}

output "service_name" {
  value = kubernetes_service.gateway.metadata[0].name
}
