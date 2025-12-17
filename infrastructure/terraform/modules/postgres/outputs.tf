output "host" {
  value = "${kubernetes_service_v1.pooler.metadata[0].name}.${var.namespace}.svc.cluster.local"
}