output "db_service_name" {
  value = kubernetes_service.db.metadata[0].name
}

output "db_service_cluster_ip" {
  value = kubernetes_service.db.spec[0].cluster_ip
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
