output "pubsub_brokers" {
  description = "Addresses of Kafka brokers for backend services to connect to."
  value       = local.PUBSUB_BROKERS
}
