output "redis_name" {
  value = kubernetes_service.redis.metadata[0].name
}

output "redis_port" {
  value = kubernetes_service.redis.spec[0].port[0].port
}

output "redis_cluster_ip" {
  value = kubernetes_service.redis.spec[0].cluster_ip
}

output "namespace" {
  value = var.namespace
}