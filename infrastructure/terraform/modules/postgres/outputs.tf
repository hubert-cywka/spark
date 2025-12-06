output "postgres_name" {
  value = kubernetes_service.postgres.metadata[0].name
}

output "postgres_cluster_ip" {
  value = kubernetes_service.postgres.spec[0].cluster_ip
}

output "pooler_service_name" {
  value = kubernetes_service.pooler.metadata[0].name
}

output "pooler_service_cluster_ip" {
  value = kubernetes_service.pooler.spec[0].cluster_ip
}

output "namespace" {
  value = var.namespace
}
