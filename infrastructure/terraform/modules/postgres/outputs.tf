output "host" {
  value = "${kubernetes_service.pooler.metadata[0].name}.${var.namespace}.svc.cluster.local"
}