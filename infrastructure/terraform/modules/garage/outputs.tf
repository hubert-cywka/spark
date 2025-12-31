output "s3_endpoint" {
  value = "http://garage.${var.namespace}.svc.cluster.local:3900"
}

output "admin_endpoint" {
  value = "http://garage.${var.namespace}.svc.cluster.local:3903"
}