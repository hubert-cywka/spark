provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "codename" {
  metadata {
    name = "codename"
  }
}

resource "kubernetes_secret" "app_secrets" {
  metadata {
    name      = "app-secrets"
    namespace = kubernetes_namespace.codename.metadata[0].name
  }

  data = {
    DATABASE_PASSWORD                          = base64encode(var.DATABASE_PASSWORD)
    JWT_SIGNING_SECRET                         = base64encode(var.JWT_SIGNING_SECRET)
    REFRESH_TOKEN_SIGNING_SECRET               = base64encode(var.REFRESH_TOKEN_SIGNING_SECRET)
    COOKIES_SECRET                             = base64encode(var.COOKIES_SECRET)
    MAIL_SENDER_PASSWORD                       = base64encode(var.MAIL_SENDER_PASSWORD)
    GOOGLE_CLIENT_SECRET                       = base64encode(var.GOOGLE_CLIENT_SECRET)
    EVENTS_ENCRYPTION_SECRET_64_BYTES          = base64encode(var.EVENTS_ENCRYPTION_SECRET_64_BYTES)
    TWO_FACTOR_AUTH_ENCRYPTION_SECRET_64_BYTES = base64encode(var.TWO_FACTOR_AUTH_ENCRYPTION_SECRET_64_BYTES)

  }
  type = "Opaque"
}

resource "kubernetes_ingress_v1" "ingress" {
  metadata {
    name      = "codename-ingress"
    namespace = kubernetes_namespace.codename.metadata[0].name

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

  namespace_name      = kubernetes_namespace.codename.metadata[0].name
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

  namespace            = kubernetes_namespace.codename.metadata[0].name
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

  namespace           = kubernetes_namespace.codename.metadata[0].name
  redis_port          = var.CACHE_PORT
  redis_image_tag     = "8.4.0"
  volume_size_request = "1Gi"
}

module "kafka_cluster" {
  source = "./modules/kafka"

  namespace                      = kubernetes_namespace.codename.metadata[0].name
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

module "journal-service" {
  source = "./modules/microservice"

  service_name   = "journal-service"
  namespace      = kubernetes_namespace.codename.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 2
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  env_vars = {
    "JOURNAL_MODULE_ENABLED"                    = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = "${module.database.pooler_service_name}.${module.database.namespace}.svc.cluster.local"
    "CACHE_CONNECTION_STRING"                   = "${module.cache.redis_name}.${module.database.namespace}.svc.cluster.local:${module.cache.redis_port}"
    "PUBSUB_BROKERS"                            = module.kafka_cluster.brokers
    "PUBSUB_CONSUMER_CONCURRENT_PARTITIONS"     = var.PUBSUB_CONSUMER_CONCURRENT_PARTITIONS
    "PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH"       = var.PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH
    "PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS"     = var.PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS
    "PUBSUB_PARTITIONS_NUM_OF_PARTITIONS"       = var.PUBSUB_PARTITIONS_NUM_OF_PARTITIONS
    "PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS"   = var.PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS
    "PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL"   = var.PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE"     = var.PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL"  = var.PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS"       = var.PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS
    "PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL"  = var.PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE"    = var.PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL" = var.PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS"      = var.PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS
    "JWT_SIGNING_SECRET"                        = var.JWT_SIGNING_SECRET
    "JOURNAL_DATABASE_NAME"                     = var.JOURNAL_DATABASE_NAME
    "COOKIES_SECRET"                            = var.COOKIES_SECRET
    "RATE_LIMITING_BASE_LIMIT"                  = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                    = var.RATE_LIMITING_BASE_TTL
    "GATEWAY_INTERNAL_URL"                      = "${module.database.service_name}.${module.gateway.namespace}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret.app_secrets.metadata[0].name
}

module "mail-service" {
  source = "./modules/microservice"

  service_name   = "mail-service"
  namespace      = kubernetes_namespace.codename.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  env_vars = {
    "MAIL_MODULE_ENABLED"                       = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = "${module.database.pooler_service_name}.${module.database.namespace}.svc.cluster.local"
    "CACHE_CONNECTION_STRING"                   = "${module.cache.redis_name}.${module.database.namespace}.svc.cluster.local:${module.cache.redis_port}"
    "PUBSUB_BROKERS"                            = module.kafka_cluster.brokers
    "PUBSUB_CONSUMER_CONCURRENT_PARTITIONS"     = var.PUBSUB_CONSUMER_CONCURRENT_PARTITIONS
    "PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH"       = var.PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH
    "PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS"     = var.PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS
    "PUBSUB_PARTITIONS_NUM_OF_PARTITIONS"       = var.PUBSUB_PARTITIONS_NUM_OF_PARTITIONS
    "PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS"   = var.PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS
    "PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL"   = var.PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE"     = var.PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL"  = var.PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS"       = var.PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS
    "PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL"  = var.PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE"    = var.PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL" = var.PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS"      = var.PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS
    "JWT_SIGNING_SECRET"                        = var.JWT_SIGNING_SECRET
    "MAIL_DATABASE_NAME"                        = var.MAIL_DATABASE_NAME
    "MAIL_SENDER_NAME"                          = var.MAIL_SENDER_NAME
    "MAIL_SENDER_PASSWORD"                      = var.MAIL_SENDER_PASSWORD
    "MAIL_DEBUG_MODE"                           = var.MAIL_DEBUG_MODE
    "COOKIES_SECRET"                            = var.COOKIES_SECRET
    "RATE_LIMITING_BASE_LIMIT"                  = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                    = var.RATE_LIMITING_BASE_TTL
    "GATEWAY_INTERNAL_URL"                      = "${module.database.service_name}.${module.gateway.namespace}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret.app_secrets.metadata[0].name
}

module "identity-service" {
  source = "./modules/microservice"

  service_name   = "identity-service"
  namespace      = kubernetes_namespace.codename.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 2
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  env_vars = {
    "IDENTITY_MODULE_ENABLED"                    = "true"
    "PORT"                                       = var.BACKEND_PORT
    "APP_NAME"                                   = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                   = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"          = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "TWO_FACTOR_AUTH_ENCRYPTION_SECRET_64_BYTES" = var.TWO_FACTOR_AUTH_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                            = var.CLIENT_URL_BASE
    "DATABASE_PORT"                              = var.DATABASE_PORT
    "DATABASE_USERNAME"                          = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                          = var.DATABASE_PASSWORD
    "DATABASE_HOST"                              = "${module.database.pooler_service_name}.${module.database.namespace}.svc.cluster.local"
    "CACHE_CONNECTION_STRING"                    = "${module.cache.redis_name}.${module.database.namespace}.svc.cluster.local:${module.cache.redis_port}"
    "PUBSUB_BROKERS"                             = module.kafka_cluster.brokers
    "PUBSUB_CONSUMER_CONCURRENT_PARTITIONS"      = var.PUBSUB_CONSUMER_CONCURRENT_PARTITIONS
    "PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH"        = var.PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH
    "PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS"      = var.PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS
    "PUBSUB_PARTITIONS_NUM_OF_PARTITIONS"        = var.PUBSUB_PARTITIONS_NUM_OF_PARTITIONS
    "PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS"    = var.PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS
    "PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL"    = var.PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE"      = var.PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL"   = var.PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS"        = var.PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS
    "PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL"   = var.PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE"     = var.PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL"  = var.PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS"       = var.PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS
    "JWT_SIGNING_SECRET"                         = var.JWT_SIGNING_SECRET
    "OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS"     = var.OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS
    "JWT_EXPIRATION_TIME_IN_SECONDS"             = var.JWT_EXPIRATION_TIME_IN_SECONDS
    "REFRESH_TOKEN_SIGNING_SECRET"               = var.REFRESH_TOKEN_SIGNING_SECRET
    "REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS"   = var.REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS
    "AUTH_DATABASE_NAME"                         = var.AUTH_DATABASE_NAME
    "AUTH_THROTTLE_LIMIT"                        = var.AUTH_THROTTLE_LIMIT
    "AUTH_THROTTLE_TTL_IN_MS"                    = var.AUTH_THROTTLE_TTL_IN_MS
    "COOKIES_SECRET"                             = var.COOKIES_SECRET
    "GOOGLE_CLIENT_ID"                           = var.GOOGLE_CLIENT_ID
    "GOOGLE_CLIENT_SECRET"                       = var.GOOGLE_CLIENT_SECRET
    "GOOGLE_OIDC_REDIRECT_URL"                   = var.GOOGLE_OIDC_REDIRECT_URL
    "RATE_LIMITING_BASE_LIMIT"                   = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                     = var.RATE_LIMITING_BASE_TTL
    "GATEWAY_INTERNAL_URL"                      = "${module.database.service_name}.${module.gateway.namespace}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret.app_secrets.metadata[0].name
}

module "gdpr-service" {
  source = "./modules/microservice"

  service_name   = "gdpr-service"
  namespace      = kubernetes_namespace.codename.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  env_vars = {
    "GDPR_MODULE_ENABLED"                       = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = "${module.database.pooler_service_name}.${module.database.namespace}.svc.cluster.local"
    "CACHE_CONNECTION_STRING"                   = "${module.cache.redis_name}.${module.database.namespace}.svc.cluster.local:${module.cache.redis_port}"
    "PUBSUB_BROKERS"                            = module.kafka_cluster.brokers
    "PUBSUB_CONSUMER_CONCURRENT_PARTITIONS"     = var.PUBSUB_CONSUMER_CONCURRENT_PARTITIONS
    "PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH"       = var.PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH
    "PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS"     = var.PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS
    "PUBSUB_PARTITIONS_NUM_OF_PARTITIONS"       = var.PUBSUB_PARTITIONS_NUM_OF_PARTITIONS
    "PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS"   = var.PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS
    "PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL"   = var.PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE"     = var.PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL"  = var.PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS"       = var.PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS
    "PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL"  = var.PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE"    = var.PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL" = var.PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS"      = var.PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS
    "JWT_SIGNING_SECRET"                        = var.JWT_SIGNING_SECRET
    "GDPR_DATABASE_NAME"                        = var.GDPR_DATABASE_NAME
    "COOKIES_SECRET"                            = var.COOKIES_SECRET
    "RATE_LIMITING_BASE_LIMIT"                  = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                    = var.RATE_LIMITING_BASE_TTL
    "GATEWAY_INTERNAL_URL"                      = "${module.database.service_name}.${module.gateway.namespace}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret.app_secrets.metadata[0].name
}

module "scheduling-service" {
  source = "./modules/microservice"

  service_name   = "scheduling-service"
  namespace      = kubernetes_namespace.codename.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  env_vars = {
    "SCHEDULING_MODULE_ENABLED"                 = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = "${module.database.pooler_service_name}.${module.database.namespace}.svc.cluster.local"
    "CACHE_CONNECTION_STRING"                   = "${module.cache.redis_name}.${module.database.namespace}.svc.cluster.local:${module.cache.redis_port}"
    "PUBSUB_BROKERS"                            = module.kafka_cluster.brokers
    "PUBSUB_CONSUMER_CONCURRENT_PARTITIONS"     = var.PUBSUB_CONSUMER_CONCURRENT_PARTITIONS
    "PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH"       = var.PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH
    "PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS"     = var.PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS
    "PUBSUB_PARTITIONS_NUM_OF_PARTITIONS"       = var.PUBSUB_PARTITIONS_NUM_OF_PARTITIONS
    "PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS"   = var.PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS
    "PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL"   = var.PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE"     = var.PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL"  = var.PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS"       = var.PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS
    "PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL"  = var.PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE"    = var.PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL" = var.PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS"      = var.PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS
    "JWT_SIGNING_SECRET"                        = var.JWT_SIGNING_SECRET
    "SCHEDULING_DATABASE_NAME"                  = var.SCHEDULING_DATABASE_NAME
    "COOKIES_SECRET"                            = var.COOKIES_SECRET
    "RATE_LIMITING_BASE_LIMIT"                  = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                    = var.RATE_LIMITING_BASE_TTL
    "GATEWAY_INTERNAL_URL"                      = "${module.database.service_name}.${module.gateway.namespace}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret.app_secrets.metadata[0].name
}

module "configuration-service" {
  source = "./modules/microservice"

  service_name   = "configuration-service"
  namespace      = kubernetes_namespace.codename.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  env_vars = {
    "CONFIGURATION_MODULE_ENABLED"              = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = "${module.database.pooler_service_name}.${module.database.namespace}.svc.cluster.local"
    "CACHE_CONNECTION_STRING"                   = "${module.cache.redis_name}.${module.database.namespace}.svc.cluster.local:${module.cache.redis_port}"
    "PUBSUB_BROKERS"                            = module.kafka_cluster.brokers
    "PUBSUB_CONSUMER_CONCURRENT_PARTITIONS"     = var.PUBSUB_CONSUMER_CONCURRENT_PARTITIONS
    "PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH"       = var.PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH
    "PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS"     = var.PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS
    "PUBSUB_PARTITIONS_NUM_OF_PARTITIONS"       = var.PUBSUB_PARTITIONS_NUM_OF_PARTITIONS
    "PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS"   = var.PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS
    "PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL"   = var.PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE"     = var.PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL"  = var.PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS"       = var.PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS
    "PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL"  = var.PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE"    = var.PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL" = var.PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS"      = var.PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS
    "JWT_SIGNING_SECRET"                        = var.JWT_SIGNING_SECRET
    "CONFIGURATION_DATABASE_NAME"               = var.CONFIGURATION_DATABASE_NAME
    "COOKIES_SECRET"                            = var.COOKIES_SECRET
    "RATE_LIMITING_BASE_LIMIT"                  = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                    = var.RATE_LIMITING_BASE_TTL
    "GATEWAY_INTERNAL_URL"                      = "${module.database.service_name}.${module.gateway.namespace}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret.app_secrets.metadata[0].name
}

module "users-service" {
  source = "./modules/microservice"

  service_name   = "users-service"
  namespace      = kubernetes_namespace.codename.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  env_vars = {
    "USERS_MODULE_ENABLED"                      = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = "${module.database.pooler_service_name}.${module.database.namespace}.svc.cluster.local"
    "CACHE_CONNECTION_STRING"                   = "${module.cache.redis_name}.${module.database.namespace}.svc.cluster.local:${module.cache.redis_port}"
    "PUBSUB_BROKERS"                            = module.kafka_cluster.brokers
    "PUBSUB_CONSUMER_CONCURRENT_PARTITIONS"     = var.PUBSUB_CONSUMER_CONCURRENT_PARTITIONS
    "PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH"       = var.PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH
    "PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS"     = var.PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS
    "PUBSUB_PARTITIONS_NUM_OF_PARTITIONS"       = var.PUBSUB_PARTITIONS_NUM_OF_PARTITIONS
    "PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS"   = var.PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS
    "PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL"   = var.PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE"     = var.PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL"  = var.PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS"       = var.PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS
    "PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL"  = var.PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE"    = var.PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL" = var.PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS"      = var.PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS
    "JWT_SIGNING_SECRET"                        = var.JWT_SIGNING_SECRET
    "USERS_DATABASE_NAME"                       = var.USERS_DATABASE_NAME
    "COOKIES_SECRET"                            = var.COOKIES_SECRET
    "RATE_LIMITING_BASE_LIMIT"                  = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                    = var.RATE_LIMITING_BASE_TTL
    "GATEWAY_INTERNAL_URL"                      = "${module.database.service_name}.${module.gateway.namespace}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret.app_secrets.metadata[0].name
}

module "alerts-service" {
  source = "./modules/microservice"

  service_name   = "alerts-service"
  namespace      = kubernetes_namespace.codename.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  env_vars = {
    "ALERTS_MODULE_ENABLED"                     = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = "${module.database.pooler_service_name}.${module.database.namespace}.svc.cluster.local"
    "CACHE_CONNECTION_STRING"                   = "${module.cache.redis_name}.${module.database.namespace}.svc.cluster.local:${module.cache.redis_port}"
    "PUBSUB_BROKERS"                            = module.kafka_cluster.brokers
    "PUBSUB_CONSUMER_CONCURRENT_PARTITIONS"     = var.PUBSUB_CONSUMER_CONCURRENT_PARTITIONS
    "PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH"       = var.PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH
    "PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS"     = var.PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS
    "PUBSUB_PARTITIONS_NUM_OF_PARTITIONS"       = var.PUBSUB_PARTITIONS_NUM_OF_PARTITIONS
    "PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS"   = var.PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS
    "PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL"   = var.PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE"     = var.PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL"  = var.PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS"       = var.PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS
    "PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL"  = var.PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE"    = var.PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE
    "PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL" = var.PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL
    "PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS"      = var.PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS
    "JWT_SIGNING_SECRET"                        = var.JWT_SIGNING_SECRET
    "ALERTS_DATABASE_NAME"                      = var.ALERTS_DATABASE_NAME
    "COOKIES_SECRET"                            = var.COOKIES_SECRET
    "RATE_LIMITING_BASE_LIMIT"                  = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                    = var.RATE_LIMITING_BASE_TTL
    "GATEWAY_INTERNAL_URL"                      = "${module.database.service_name}.${module.gateway.namespace}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret.app_secrets.metadata[0].name
}

module "frontend" {
  source = "./modules/microservice"

  service_name   = "frontend"
  namespace      = kubernetes_namespace.codename.metadata[0].name
  image          = "hejs22/codename-frontend:latest"
  replicas       = 1
  service_port   = var.FRONTEND_PORT
  container_port = var.FRONTEND_PORT

  env_vars = {
    PORT                = var.FRONTEND_PORT
    NEXT_PUBLIC_API_URL = var.GATEWAY_URL
  }

  secret_name = kubernetes_secret.app_secrets.metadata[0].name

  liveness_path           = "/"
  liveness_period_seconds = 10

  readiness_path           = "/"
  readiness_period_seconds = 5

  enable_startup_probe = false
}
