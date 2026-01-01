locals {
  journal_service_name       = "journal-service"
  mail_service_name          = "mail-service"
  identity_service_name      = "identity-service"
  privacy_service_name       = "privacy-service"
  exports_service_name       = "exports-service"
  scheduling_service_name    = "scheduling-service"
  configuration_service_name = "configuration-service"
  alerts_service_name        = "alerts-service"
  users_service_name         = "users-service"
}

module "frontend" {
  source = "./modules/microservice"

  service_name   = "frontend"
  namespace      = kubernetes_namespace_v1.app.metadata[0].name
  image          = "hejs22/codename-frontend:latest"
  replicas       = 1
  service_port   = var.FRONTEND_PORT
  container_port = var.FRONTEND_PORT

  env_vars = {
    PORT                = var.FRONTEND_PORT
    NEXT_PUBLIC_API_URL = var.GATEWAY_URL
  }

  secret_name = kubernetes_secret_v1.app_secrets.metadata[0].name

  liveness_path           = "/"
  liveness_period_seconds = 10

  readiness_path           = "/"
  readiness_period_seconds = 5

  enable_startup_probe = false
}

module "journal-service" {
  source = "./modules/microservice"

  service_name   = local.journal_service_name
  namespace      = kubernetes_namespace_v1.app.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 2
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  depends_on = [
    module.database,
    module.cache,
    module.kafka_cluster,
    module.s3,
    helm_release.keda
  ]

  #   keda_prometheus_trigger = [
  #       {
  #         server_address = "${module.observability.prometheus_address}"
  #         metric_name    = "http_requests_total"
  #         query          = "sum(rate(http_requests_total{app='${local.journal_service_name}'}[2m]))"
  #         threshold      = "100"
  #       }
  #     ]

  env_vars = {
    "JOURNAL_MODULE_ENABLED"                    = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "OTEL_APP_NAME"                             = "${var.APP_NAME}-${local.journal_service_name}"
    "OTEL_EXPORTER_OTLP_ENDPOINT"               = module.observability.otel_collector_address
    "OTEL_EXPORTER_OTLP_PROTOCOL"               = "grpc"
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = module.database.host
    "CACHE_CONNECTION_STRING"                   = module.cache.connection_string
    "S3_ACCESS_KEY_ID"                          = var.S3_ACCESS_KEY_ID
    "S3_SECRET_ACCESS_KEY"                      = var.S3_SECRET_ACCESS_KEY
    "S3_REGION"                                 = var.S3_REGION
    "S3_BUCKET_NAME"                            = var.S3_BUCKET_NAME
    "S3_ENDPOINT"                               = module.s3.s3_endpoint
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
    "GATEWAY_INTERNAL_URL"                      = "gateway.${kubernetes_namespace_v1.app.metadata[0].name}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret_v1.app_secrets.metadata[0].name
}

module "mail-service" {
  source = "./modules/microservice"

  service_name   = local.mail_service_name
  namespace      = kubernetes_namespace_v1.app.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  depends_on = [
    module.database,
    module.cache,
    module.s3,
    module.kafka_cluster
  ]

  env_vars = {
    "MAIL_MODULE_ENABLED"                       = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "OTEL_APP_NAME"                             = "${var.APP_NAME}-${local.mail_service_name}"
    "OTEL_EXPORTER_OTLP_ENDPOINT"               = module.observability.otel_collector_address
    "OTEL_EXPORTER_OTLP_PROTOCOL"               = "grpc"
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = module.database.host
    "CACHE_CONNECTION_STRING"                   = module.cache.connection_string
    "S3_ACCESS_KEY_ID"                          = var.S3_ACCESS_KEY_ID
    "S3_SECRET_ACCESS_KEY"                      = var.S3_SECRET_ACCESS_KEY
    "S3_REGION"                                 = var.S3_REGION
    "S3_BUCKET_NAME"                            = var.S3_BUCKET_NAME
    "S3_ENDPOINT"                               = module.s3.s3_endpoint
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
    "GATEWAY_INTERNAL_URL"                      = "gateway.${kubernetes_namespace_v1.app.metadata[0].name}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret_v1.app_secrets.metadata[0].name
}

module "identity-service" {
  source = "./modules/microservice"

  service_name   = local.identity_service_name
  namespace      = kubernetes_namespace_v1.app.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  depends_on = [
    module.database,
    module.cache,
    module.s3,
    module.kafka_cluster
  ]

  env_vars = {
    "IDENTITY_MODULE_ENABLED"                    = "true"
    "PORT"                                       = var.BACKEND_PORT
    "APP_NAME"                                   = var.APP_NAME
    "OTEL_APP_NAME"                              = "${var.APP_NAME}-${local.identity_service_name}"
    "OTEL_EXPORTER_OTLP_ENDPOINT"                = module.observability.otel_collector_address
    "OTEL_EXPORTER_OTLP_PROTOCOL"                = "grpc"
    "DATABASE_LOGGING_ENABLED"                   = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"          = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "TWO_FACTOR_AUTH_ENCRYPTION_SECRET_64_BYTES" = var.TWO_FACTOR_AUTH_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                            = var.CLIENT_URL_BASE
    "DATABASE_PORT"                              = var.DATABASE_PORT
    "DATABASE_USERNAME"                          = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                          = var.DATABASE_PASSWORD
    "DATABASE_HOST"                              = module.database.host
    "CACHE_CONNECTION_STRING"                    = module.cache.connection_string
    "S3_ACCESS_KEY_ID"                           = var.S3_ACCESS_KEY_ID
    "S3_SECRET_ACCESS_KEY"                       = var.S3_SECRET_ACCESS_KEY
    "S3_REGION"                                  = var.S3_REGION
    "S3_BUCKET_NAME"                             = var.S3_BUCKET_NAME
    "S3_ENDPOINT"                                = module.s3.s3_endpoint
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
    "COOKIES_SECRET"                             = var.COOKIES_SECRET
    "GOOGLE_CLIENT_ID"                           = var.GOOGLE_CLIENT_ID
    "GOOGLE_CLIENT_SECRET"                       = var.GOOGLE_CLIENT_SECRET
    "GOOGLE_OIDC_REDIRECT_URL"                   = var.GOOGLE_OIDC_REDIRECT_URL
    "GATEWAY_INTERNAL_URL"                       = "gateway.${kubernetes_namespace_v1.app.metadata[0].name}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret_v1.app_secrets.metadata[0].name
}

module "privacy-service" {
  source = "./modules/microservice"

  service_name   = local.privacy_service_name
  namespace      = kubernetes_namespace_v1.app.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  depends_on = [
    module.database,
    module.cache,
    module.s3,
    module.kafka_cluster
  ]

  env_vars = {
    "PRIVACY_MODULE_ENABLED"                    = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "OTEL_APP_NAME"                             = "${var.APP_NAME}-${local.privacy_service_name}"
    "OTEL_EXPORTER_OTLP_ENDPOINT"               = module.observability.otel_collector_address
    "OTEL_EXPORTER_OTLP_PROTOCOL"               = "grpc"
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = module.database.host
    "CACHE_CONNECTION_STRING"                   = module.cache.connection_string
    "S3_ACCESS_KEY_ID"                          = var.S3_ACCESS_KEY_ID
    "S3_SECRET_ACCESS_KEY"                      = var.S3_SECRET_ACCESS_KEY
    "S3_REGION"                                 = var.S3_REGION
    "S3_BUCKET_NAME"                            = var.S3_BUCKET_NAME
    "S3_ENDPOINT"                               = module.s3.s3_endpoint
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
    "PRIVACY_DATABASE_NAME"                     = var.PRIVACY_DATABASE_NAME
    "COOKIES_SECRET"                            = var.COOKIES_SECRET
    "GATEWAY_INTERNAL_URL"                      = "gateway.${kubernetes_namespace_v1.app.metadata[0].name}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret_v1.app_secrets.metadata[0].name
}

module "exports-service" {
  source = "./modules/microservice"

  service_name   = local.exports_service_name
  namespace      = kubernetes_namespace_v1.app.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  depends_on = [
    module.database,
    module.cache,
    module.s3,
    module.kafka_cluster
  ]

  env_vars = {
    "EXPORTS_MODULE_ENABLED"                    = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "OTEL_APP_NAME"                             = "${var.APP_NAME}-${local.exports_service_name}"
    "OTEL_EXPORTER_OTLP_ENDPOINT"               = module.observability.otel_collector_address
    "OTEL_EXPORTER_OTLP_PROTOCOL"               = "grpc"
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = module.database.host
    "CACHE_CONNECTION_STRING"                   = module.cache.connection_string
    "S3_ACCESS_KEY_ID"                          = var.S3_ACCESS_KEY_ID
    "S3_SECRET_ACCESS_KEY"                      = var.S3_SECRET_ACCESS_KEY
    "S3_REGION"                                 = var.S3_REGION
    "S3_BUCKET_NAME"                            = var.S3_BUCKET_NAME
    "S3_ENDPOINT"                               = module.s3.s3_endpoint
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
    "EXPORTS_DATABASE_NAME"                     = var.EXPORTS_DATABASE_NAME
    "COOKIES_SECRET"                            = var.COOKIES_SECRET
    "GATEWAY_INTERNAL_URL"                      = "gateway.${kubernetes_namespace_v1.app.metadata[0].name}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret_v1.app_secrets.metadata[0].name
}

module "scheduling-service" {
  source = "./modules/microservice"

  service_name   = local.scheduling_service_name
  namespace      = kubernetes_namespace_v1.app.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  depends_on = [
    module.database,
    module.cache,
    module.s3,
    module.kafka_cluster
  ]

  env_vars = {
    "SCHEDULING_MODULE_ENABLED"                 = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "OTEL_APP_NAME"                             = "${var.APP_NAME}-${local.scheduling_service_name}"
    "OTEL_EXPORTER_OTLP_ENDPOINT"               = module.observability.otel_collector_address
    "OTEL_EXPORTER_OTLP_PROTOCOL"               = "grpc"
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = module.database.host
    "CACHE_CONNECTION_STRING"                   = module.cache.connection_string
    "S3_ACCESS_KEY_ID"                          = var.S3_ACCESS_KEY_ID
    "S3_SECRET_ACCESS_KEY"                      = var.S3_SECRET_ACCESS_KEY
    "S3_REGION"                                 = var.S3_REGION
    "S3_BUCKET_NAME"                            = var.S3_BUCKET_NAME
    "S3_ENDPOINT"                               = module.s3.s3_endpoint
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
    "GATEWAY_INTERNAL_URL"                      = "gateway.${kubernetes_namespace_v1.app.metadata[0].name}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret_v1.app_secrets.metadata[0].name
}

module "configuration-service" {
  source = "./modules/microservice"

  service_name   = local.configuration_service_name
  namespace      = kubernetes_namespace_v1.app.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  depends_on = [
    module.database,
    module.cache,
    module.s3,
    module.kafka_cluster
  ]

  env_vars = {
    "CONFIGURATION_MODULE_ENABLED"              = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "OTEL_APP_NAME"                             = "${var.APP_NAME}-${local.configuration_service_name}"
    "OTEL_EXPORTER_OTLP_ENDPOINT"               = module.observability.otel_collector_address
    "OTEL_EXPORTER_OTLP_PROTOCOL"               = "grpc"
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = module.database.host
    "CACHE_CONNECTION_STRING"                   = module.cache.connection_string
    "S3_ACCESS_KEY_ID"                          = var.S3_ACCESS_KEY_ID
    "S3_SECRET_ACCESS_KEY"                      = var.S3_SECRET_ACCESS_KEY
    "S3_REGION"                                 = var.S3_REGION
    "S3_BUCKET_NAME"                            = var.S3_BUCKET_NAME
    "S3_ENDPOINT"                               = module.s3.s3_endpoint
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
    "GATEWAY_INTERNAL_URL"                      = "gateway.${kubernetes_namespace_v1.app.metadata[0].name}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret_v1.app_secrets.metadata[0].name
}

module "users-service" {
  source = "./modules/microservice"

  service_name   = local.users_service_name
  namespace      = kubernetes_namespace_v1.app.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  depends_on = [
    module.database,
    module.cache,
    module.s3,
    module.kafka_cluster
  ]

  env_vars = {
    "USERS_MODULE_ENABLED"                      = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "OTEL_APP_NAME"                             = "${var.APP_NAME}-${local.users_service_name}"
    "OTEL_EXPORTER_OTLP_ENDPOINT"               = module.observability.otel_collector_address
    "OTEL_EXPORTER_OTLP_PROTOCOL"               = "grpc"
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = module.database.host
    "CACHE_CONNECTION_STRING"                   = module.cache.connection_string
    "S3_ACCESS_KEY_ID"                          = var.S3_ACCESS_KEY_ID
    "S3_SECRET_ACCESS_KEY"                      = var.S3_SECRET_ACCESS_KEY
    "S3_REGION"                                 = var.S3_REGION
    "S3_BUCKET_NAME"                            = var.S3_BUCKET_NAME
    "S3_ENDPOINT"                               = module.s3.s3_endpoint
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
    "GATEWAY_INTERNAL_URL"                      = "gateway.${kubernetes_namespace_v1.app.metadata[0].name}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret_v1.app_secrets.metadata[0].name
}

module "alerts-service" {
  source = "./modules/microservice"

  service_name   = local.alerts_service_name
  namespace      = kubernetes_namespace_v1.app.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  depends_on = [
    module.database,
    module.cache,
    module.s3,
    module.kafka_cluster
  ]

  env_vars = {
    "ALERTS_MODULE_ENABLED"                     = "true"
    "PORT"                                      = var.BACKEND_PORT
    "APP_NAME"                                  = var.APP_NAME
    "OTEL_APP_NAME"                             = "${var.APP_NAME}-${local.alerts_service_name}"
    "OTEL_EXPORTER_OTLP_ENDPOINT"               = module.observability.otel_collector_address
    "OTEL_EXPORTER_OTLP_PROTOCOL"               = "grpc"
    "DATABASE_LOGGING_ENABLED"                  = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"         = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                           = var.CLIENT_URL_BASE
    "DATABASE_PORT"                             = var.DATABASE_PORT
    "DATABASE_USERNAME"                         = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                         = var.DATABASE_PASSWORD
    "DATABASE_HOST"                             = module.database.host
    "CACHE_CONNECTION_STRING"                   = module.cache.connection_string
    "S3_ACCESS_KEY_ID"                          = var.S3_ACCESS_KEY_ID
    "S3_SECRET_ACCESS_KEY"                      = var.S3_SECRET_ACCESS_KEY
    "S3_REGION"                                 = var.S3_REGION
    "S3_BUCKET_NAME"                            = var.S3_BUCKET_NAME
    "S3_ENDPOINT"                               = module.s3.s3_endpoint
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
    "GATEWAY_INTERNAL_URL"                      = "gateway.${kubernetes_namespace_v1.app.metadata[0].name}.svc.cluster.local:${var.GATEWAY_INTERNAL_PORT}"
  }

  secret_name = kubernetes_secret_v1.app_secrets.metadata[0].name
}

