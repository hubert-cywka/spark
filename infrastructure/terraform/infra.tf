
resource "kubernetes_ingress_v1" "ingress" {
  metadata {
    name      = "codename-ingress"
    namespace = kubernetes_namespace_v1.app.metadata[0].name

    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/"
    }
  }

  spec {
    ingress_class_name = "nginx"

    rule {
      http {
        path {
          path      = "/"
          path_type = "Prefix"

          backend {
            service {
              name = module.gateway.service_name
              port {
                number = var.GATEWAY_PORT
              }
            }
          }
        }
      }
    }
  }
}


module "gateway" {
  source = "./modules/envoy"

  namespace           = kubernetes_namespace_v1.app.metadata[0].name
  envoy_port          = var.GATEWAY_PORT
  envoy_internal_port = var.GATEWAY_INTERNAL_PORT
  backend_port        = var.BACKEND_PORT
  frontend_port       = var.FRONTEND_PORT
  allowed_origins     = var.ALLOWED_ORIGINS

  identity_service_name      = module.identity-service.service_name
  journal_service_name       = module.journal-service.service_name
  users_service_name         = module.users-service.service_name
  alerts_service_name        = module.alerts-service.service_name
  gdpr_service_name          = module.gdpr-service.service_name
  mail_service_name          = module.mail-service.service_name
  frontend_service_name      = module.frontend.service_name
  scheduling_service_name    = module.scheduling-service.service_name
  configuration_service_name = module.configuration-service.service_name
}

module "database" {
  source = "./modules/postgres"

  namespace            = kubernetes_namespace_v1.app.metadata[0].name
  database_username    = var.DATABASE_USERNAME
  database_password    = var.DATABASE_PASSWORD
  database_port        = var.DATABASE_PORT
  volume_size_request  = "2Gi"
  postgresql_image_tag = "17.0"
  pgbouncer_image_tag  = "1.24.1"
  pgbouncer_pool_mode  = "transaction"
}

module "cache" {
  source = "./modules/redis"

  namespace           = kubernetes_namespace_v1.app.metadata[0].name
  redis_port          = var.CACHE_PORT
  redis_image_tag     = "8.4.0"
  volume_size_request = "1Gi"
}

module "kafka_cluster" {
  source = "./modules/kafka"

  namespace                      = kubernetes_namespace_v1.app.metadata[0].name
  controller_replicas            = 5
  broker_replicas                = 5
  broker_volume_size_request     = "2Gi"
  controller_volume_size_request = "1Gi"

  cluster_id               = var.KAFKA_CLUSTER_ID
  num_partitions           = var.KAFKA_NUM_PARTITIONS
  broker_internal_port     = var.KAFKA_BROKER_INTERNAL_PORT
  controller_internal_port = var.KAFKA_CONTROLLER_INTERNAL_PORT
  log_segment_bytes        = var.KAFKA_LOG_SEGMENT_BYTES
}
