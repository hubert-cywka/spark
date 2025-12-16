output "connection_string" {
  value = "redis://${kubernetes_service.redis.metadata[0].name}.${var.namespace}.svc.cluster.local:${kubernetes_service.redis.spec[0].port[0].port}"
}
