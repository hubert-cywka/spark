provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "codename" {
  metadata {
    name = "codename"
  }
}

resource "kubernetes_config_map" "app_config" {
  metadata {
    name      = "app-config"
    namespace = kubernetes_namespace.codename.metadata[0].name
  }

  data = {
    APP_NAME = var.APP_NAME

    EVENTS_ENCRYPTION_SECRET_64_BYTES = var.EVENTS_ENCRYPTION_SECRET_64_BYTES

    RATE_LIMITING_BASE_LIMIT = var.RATE_LIMITING_BASE_LIMIT
    RATE_LIMITING_BASE_TTL   = var.RATE_LIMITING_BASE_TTL

    DATABASE_LOGGING_ENABLED = var.DATABASE_LOGGING_ENABLED
    DATABASE_PORT            = var.DATABASE_PORT
    DATABASE_USERNAME        = var.DATABASE_USERNAME
    DATABASE_PASSWORD        = var.DATABASE_PASSWORD

    CLIENT_URL_BASE = var.CLIENT_URL_BASE

    PUBSUB_PORT = var.PUBSUB_PORT

    BACKEND_PORT                             = var.BACKEND_PORT
    JWT_SIGNING_SECRET                       = var.JWT_SIGNING_SECRET
    OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS   = var.OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS
    JWT_EXPIRATION_TIME_IN_SECONDS           = var.JWT_EXPIRATION_TIME_IN_SECONDS
    REFRESH_TOKEN_SIGNING_SECRET             = var.REFRESH_TOKEN_SIGNING_SECRET
    REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS = var.REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS

    AUTH_DATABASE_NAME      = var.AUTH_DATABASE_NAME
    AUTH_THROTTLE_TTL_IN_MS = var.AUTH_THROTTLE_TTL_IN_MS
    AUTH_THROTTLE_LIMIT     = var.AUTH_THROTTLE_LIMIT

    USERS_DATABASE_NAME = var.USERS_DATABASE_NAME

    JOURNAL_DATABASE_NAME = var.JOURNAL_DATABASE_NAME

    ALERTS_DATABASE_NAME = var.ALERTS_DATABASE_NAME

    GDPR_DATABASE_NAME = var.GDPR_DATABASE_NAME

    MAIL_DATABASE_NAME = var.MAIL_DATABASE_NAME

    FRONTEND_PORT = var.FRONTEND_PORT

    GATEWAY_PORT    = var.GATEWAY_PORT
    ALLOWED_ORIGINS = var.ALLOWED_ORIGINS
    GATEWAY_URL     = var.GATEWAY_URL

    MAIL_SENDER_PORT     = var.MAIL_SENDER_PORT
    MAIL_SENDER_NAME     = var.MAIL_SENDER_NAME
    MAIL_SENDER_USER     = var.MAIL_SENDER_USER
    MAIL_SENDER_PASSWORD = var.MAIL_SENDER_PASSWORD
    MAIL_SENDER_PORT     = var.MAIL_SENDER_PORT
    MAIL_DEBUG_MODE      = var.MAIL_DEBUG_MODE

    GOOGLE_CLIENT_ID         = var.GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET     = var.GOOGLE_CLIENT_SECRET
    GOOGLE_OIDC_REDIRECT_URL = var.GOOGLE_OIDC_REDIRECT_URL

    COOKIES_SECRET = var.COOKIES_SECRET

    PGBOUNCER_POOL_MODE          = var.PGBOUNCER_POOL_MODE
    PGBOUNCER_QUERY_WAIT_TIMEOUT = var.PGBOUNCER_QUERY_WAIT_TIMEOUT
    PGBOUNCER_MAX_CLIENT_CONN    = var.PGBOUNCER_MAX_CLIENT_CONN
    PGBOUNCER_DEFAULT_POOL_SIZE  = var.PGBOUNCER_DEFAULT_POOL_SIZE
    PGBOUNCER_STATS_USERS        = var.PGBOUNCER_STATS_USERS
    PGBOUNCER_DATABASE           = var.PGBOUNCER_DATABASE
    POSTGRESQL_PORT              = var.POSTGRESQL_PORT
  }
}

module "journal-service" {
  source = "./modules/microservice"

  service_name   = "journal-service"
  namespace      = kubernetes_namespace.codename.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  env_vars = {
    "JOURNAL_SERVICE_ENABLED"                  = "true"
    "PORT"                                     = var.BACKEND_PORT
    "APP_NAME"                                 = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                 = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"        = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                          = var.CLIENT_URL_BASE
    "DATABASE_PORT"                            = var.DATABASE_PORT
    "DATABASE_USERNAME"                        = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                        = var.DATABASE_PASSWORD
    "DATABASE_HOST"                            = "${kubernetes_service.pooler.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
    "PUBSUB_HOST"                              = "${kubernetes_service.pubsub.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
    "PUBSUB_PORT"                              = var.PUBSUB_PORT
    "JWT_SIGNING_SECRET"                       = var.JWT_SIGNING_SECRET
    "OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS"   = var.OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS
    "JWT_EXPIRATION_TIME_IN_SECONDS"           = var.JWT_EXPIRATION_TIME_IN_SECONDS
    "REFRESH_TOKEN_SIGNING_SECRET"             = var.REFRESH_TOKEN_SIGNING_SECRET
    "REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS" = var.REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS
    "AUTH_DATABASE_NAME"                       = var.AUTH_DATABASE_NAME
    "AUTH_THROTTLE_LIMIT"                      = var.AUTH_THROTTLE_LIMIT
    "AUTH_THROTTLE_TTL_IN_MS"                  = var.AUTH_THROTTLE_TTL_IN_MS
    "USERS_DATABASE_NAME"                      = var.USERS_DATABASE_NAME
    "JOURNAL_DATABASE_NAME"                    = var.JOURNAL_DATABASE_NAME
    "ALERTS_DATABASE_NAME"                     = var.ALERTS_DATABASE_NAME
    "GDPR_DATABASE_NAME"                       = var.GDPR_DATABASE_NAME
    "MAIL_DATABASE_NAME"                       = var.MAIL_DATABASE_NAME
    "MAIL_SENDER_NAME"                         = var.MAIL_SENDER_NAME
    "MAIL_SENDER_USER"                         = var.MAIL_SENDER_USER
    "MAIL_SENDER_PASSWORD"                     = var.MAIL_SENDER_PASSWORD
    "MAIL_SENDER_HOST"                         = var.MAIL_SENDER_HOST
    "MAIL_SENDER_PORT"                         = var.MAIL_SENDER_PORT
    "MAIL_DEBUG_MODE"                          = var.MAIL_DEBUG_MODE
    "COOKIES_SECRET"                           = var.COOKIES_SECRET
    "GOOGLE_CLIENT_ID"                         = var.GOOGLE_CLIENT_ID
    "GOOGLE_CLIENT_SECRET"                     = var.GOOGLE_CLIENT_SECRET
    "GOOGLE_OIDC_REDIRECT_URL"                 = var.GOOGLE_OIDC_REDIRECT_URL
    "RATE_LIMITING_BASE_LIMIT"                 = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                   = var.RATE_LIMITING_BASE_TTL
  }

  depends_on = [
    kubernetes_service.pooler,
    kubernetes_service.pubsub,
  ]
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
    "MAIL_SERVICE_ENABLED"                     = "true"
    "PORT"                                     = var.BACKEND_PORT
    "APP_NAME"                                 = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                 = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"        = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                          = var.CLIENT_URL_BASE
    "DATABASE_PORT"                            = var.DATABASE_PORT
    "DATABASE_USERNAME"                        = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                        = var.DATABASE_PASSWORD
    "DATABASE_HOST"                            = "${kubernetes_service.pooler.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
    "PUBSUB_HOST"                              = "${kubernetes_service.pubsub.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
    "PUBSUB_PORT"                              = var.PUBSUB_PORT
    "JWT_SIGNING_SECRET"                       = var.JWT_SIGNING_SECRET
    "OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS"   = var.OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS
    "JWT_EXPIRATION_TIME_IN_SECONDS"           = var.JWT_EXPIRATION_TIME_IN_SECONDS
    "REFRESH_TOKEN_SIGNING_SECRET"             = var.REFRESH_TOKEN_SIGNING_SECRET
    "REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS" = var.REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS
    "AUTH_DATABASE_NAME"                       = var.AUTH_DATABASE_NAME
    "AUTH_THROTTLE_LIMIT"                      = var.AUTH_THROTTLE_LIMIT
    "AUTH_THROTTLE_TTL_IN_MS"                  = var.AUTH_THROTTLE_TTL_IN_MS
    "USERS_DATABASE_NAME"                      = var.USERS_DATABASE_NAME
    "JOURNAL_DATABASE_NAME"                    = var.JOURNAL_DATABASE_NAME
    "ALERTS_DATABASE_NAME"                     = var.ALERTS_DATABASE_NAME
    "GDPR_DATABASE_NAME"                       = var.GDPR_DATABASE_NAME
    "MAIL_DATABASE_NAME"                       = var.MAIL_DATABASE_NAME
    "MAIL_SENDER_NAME"                         = var.MAIL_SENDER_NAME
    "MAIL_SENDER_USER"                         = var.MAIL_SENDER_USER
    "MAIL_SENDER_PASSWORD"                     = var.MAIL_SENDER_PASSWORD
    "MAIL_SENDER_HOST"                         = var.MAIL_SENDER_HOST
    "MAIL_SENDER_PORT"                         = var.MAIL_SENDER_PORT
    "MAIL_DEBUG_MODE"                          = var.MAIL_DEBUG_MODE
    "COOKIES_SECRET"                           = var.COOKIES_SECRET
    "GOOGLE_CLIENT_ID"                         = var.GOOGLE_CLIENT_ID
    "GOOGLE_CLIENT_SECRET"                     = var.GOOGLE_CLIENT_SECRET
    "GOOGLE_OIDC_REDIRECT_URL"                 = var.GOOGLE_OIDC_REDIRECT_URL
    "RATE_LIMITING_BASE_LIMIT"                 = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                   = var.RATE_LIMITING_BASE_TTL
  }

  depends_on = [
    kubernetes_service.pooler,
    kubernetes_service.pubsub,
  ]
}

module "identity-service" {
  source = "./modules/microservice"

  service_name   = "identity-service"
  namespace      = kubernetes_namespace.codename.metadata[0].name
  image          = "hejs22/codename-backend:latest"
  replicas       = 1
  service_port   = var.BACKEND_PORT
  container_port = var.BACKEND_PORT

  env_vars = {
    "IDENTITY_SERVICE_ENABLED"                 = "true"
    "PORT"                                     = var.BACKEND_PORT
    "APP_NAME"                                 = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                 = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"        = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                          = var.CLIENT_URL_BASE
    "DATABASE_PORT"                            = var.DATABASE_PORT
    "DATABASE_USERNAME"                        = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                        = var.DATABASE_PASSWORD
    "DATABASE_HOST"                            = "${kubernetes_service.pooler.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
    "PUBSUB_HOST"                              = "${kubernetes_service.pubsub.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
    "PUBSUB_PORT"                              = var.PUBSUB_PORT
    "JWT_SIGNING_SECRET"                       = var.JWT_SIGNING_SECRET
    "OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS"   = var.OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS
    "JWT_EXPIRATION_TIME_IN_SECONDS"           = var.JWT_EXPIRATION_TIME_IN_SECONDS
    "REFRESH_TOKEN_SIGNING_SECRET"             = var.REFRESH_TOKEN_SIGNING_SECRET
    "REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS" = var.REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS
    "AUTH_DATABASE_NAME"                       = var.AUTH_DATABASE_NAME
    "AUTH_THROTTLE_LIMIT"                      = var.AUTH_THROTTLE_LIMIT
    "AUTH_THROTTLE_TTL_IN_MS"                  = var.AUTH_THROTTLE_TTL_IN_MS
    "USERS_DATABASE_NAME"                      = var.USERS_DATABASE_NAME
    "JOURNAL_DATABASE_NAME"                    = var.JOURNAL_DATABASE_NAME
    "ALERTS_DATABASE_NAME"                     = var.ALERTS_DATABASE_NAME
    "GDPR_DATABASE_NAME"                       = var.GDPR_DATABASE_NAME
    "MAIL_DATABASE_NAME"                       = var.MAIL_DATABASE_NAME
    "MAIL_SENDER_NAME"                         = var.MAIL_SENDER_NAME
    "MAIL_SENDER_USER"                         = var.MAIL_SENDER_USER
    "MAIL_SENDER_PASSWORD"                     = var.MAIL_SENDER_PASSWORD
    "MAIL_SENDER_HOST"                         = var.MAIL_SENDER_HOST
    "MAIL_SENDER_PORT"                         = var.MAIL_SENDER_PORT
    "MAIL_DEBUG_MODE"                          = var.MAIL_DEBUG_MODE
    "COOKIES_SECRET"                           = var.COOKIES_SECRET
    "GOOGLE_CLIENT_ID"                         = var.GOOGLE_CLIENT_ID
    "GOOGLE_CLIENT_SECRET"                     = var.GOOGLE_CLIENT_SECRET
    "GOOGLE_OIDC_REDIRECT_URL"                 = var.GOOGLE_OIDC_REDIRECT_URL
    "RATE_LIMITING_BASE_LIMIT"                 = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                   = var.RATE_LIMITING_BASE_TTL
  }

  depends_on = [
    kubernetes_service.pooler,
    kubernetes_service.pubsub,
  ]
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
    "GDPR_SERVICE_ENABLED"                     = "true"
    "PORT"                                     = var.BACKEND_PORT
    "APP_NAME"                                 = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                 = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"        = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                          = var.CLIENT_URL_BASE
    "DATABASE_PORT"                            = var.DATABASE_PORT
    "DATABASE_USERNAME"                        = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                        = var.DATABASE_PASSWORD
    "DATABASE_HOST"                            = "${kubernetes_service.pooler.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
    "PUBSUB_HOST"                              = "${kubernetes_service.pubsub.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
    "PUBSUB_PORT"                              = var.PUBSUB_PORT
    "JWT_SIGNING_SECRET"                       = var.JWT_SIGNING_SECRET
    "OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS"   = var.OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS
    "JWT_EXPIRATION_TIME_IN_SECONDS"           = var.JWT_EXPIRATION_TIME_IN_SECONDS
    "REFRESH_TOKEN_SIGNING_SECRET"             = var.REFRESH_TOKEN_SIGNING_SECRET
    "REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS" = var.REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS
    "AUTH_DATABASE_NAME"                       = var.AUTH_DATABASE_NAME
    "AUTH_THROTTLE_LIMIT"                      = var.AUTH_THROTTLE_LIMIT
    "AUTH_THROTTLE_TTL_IN_MS"                  = var.AUTH_THROTTLE_TTL_IN_MS
    "USERS_DATABASE_NAME"                      = var.USERS_DATABASE_NAME
    "JOURNAL_DATABASE_NAME"                    = var.JOURNAL_DATABASE_NAME
    "ALERTS_DATABASE_NAME"                     = var.ALERTS_DATABASE_NAME
    "GDPR_DATABASE_NAME"                       = var.GDPR_DATABASE_NAME
    "MAIL_DATABASE_NAME"                       = var.MAIL_DATABASE_NAME
    "MAIL_SENDER_NAME"                         = var.MAIL_SENDER_NAME
    "MAIL_SENDER_USER"                         = var.MAIL_SENDER_USER
    "MAIL_SENDER_PASSWORD"                     = var.MAIL_SENDER_PASSWORD
    "MAIL_SENDER_HOST"                         = var.MAIL_SENDER_HOST
    "MAIL_SENDER_PORT"                         = var.MAIL_SENDER_PORT
    "MAIL_DEBUG_MODE"                          = var.MAIL_DEBUG_MODE
    "COOKIES_SECRET"                           = var.COOKIES_SECRET
    "GOOGLE_CLIENT_ID"                         = var.GOOGLE_CLIENT_ID
    "GOOGLE_CLIENT_SECRET"                     = var.GOOGLE_CLIENT_SECRET
    "GOOGLE_OIDC_REDIRECT_URL"                 = var.GOOGLE_OIDC_REDIRECT_URL
    "RATE_LIMITING_BASE_LIMIT"                 = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                   = var.RATE_LIMITING_BASE_TTL
  }

  depends_on = [
    kubernetes_service.pooler,
    kubernetes_service.pubsub,
  ]
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
    "USERS_SERVICE_ENABLED"                    = "true"
    "PORT"                                     = var.BACKEND_PORT
    "APP_NAME"                                 = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                 = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"        = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                          = var.CLIENT_URL_BASE
    "DATABASE_PORT"                            = var.DATABASE_PORT
    "DATABASE_USERNAME"                        = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                        = var.DATABASE_PASSWORD
    "DATABASE_HOST"                            = "${kubernetes_service.pooler.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
    "PUBSUB_HOST"                              = "${kubernetes_service.pubsub.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
    "PUBSUB_PORT"                              = var.PUBSUB_PORT
    "JWT_SIGNING_SECRET"                       = var.JWT_SIGNING_SECRET
    "OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS"   = var.OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS
    "JWT_EXPIRATION_TIME_IN_SECONDS"           = var.JWT_EXPIRATION_TIME_IN_SECONDS
    "REFRESH_TOKEN_SIGNING_SECRET"             = var.REFRESH_TOKEN_SIGNING_SECRET
    "REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS" = var.REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS
    "AUTH_DATABASE_NAME"                       = var.AUTH_DATABASE_NAME
    "AUTH_THROTTLE_LIMIT"                      = var.AUTH_THROTTLE_LIMIT
    "AUTH_THROTTLE_TTL_IN_MS"                  = var.AUTH_THROTTLE_TTL_IN_MS
    "USERS_DATABASE_NAME"                      = var.USERS_DATABASE_NAME
    "JOURNAL_DATABASE_NAME"                    = var.JOURNAL_DATABASE_NAME
    "ALERTS_DATABASE_NAME"                     = var.ALERTS_DATABASE_NAME
    "GDPR_DATABASE_NAME"                       = var.GDPR_DATABASE_NAME
    "MAIL_DATABASE_NAME"                       = var.MAIL_DATABASE_NAME
    "MAIL_SENDER_NAME"                         = var.MAIL_SENDER_NAME
    "MAIL_SENDER_USER"                         = var.MAIL_SENDER_USER
    "MAIL_SENDER_PASSWORD"                     = var.MAIL_SENDER_PASSWORD
    "MAIL_SENDER_HOST"                         = var.MAIL_SENDER_HOST
    "MAIL_SENDER_PORT"                         = var.MAIL_SENDER_PORT
    "MAIL_DEBUG_MODE"                          = var.MAIL_DEBUG_MODE
    "COOKIES_SECRET"                           = var.COOKIES_SECRET
    "GOOGLE_CLIENT_ID"                         = var.GOOGLE_CLIENT_ID
    "GOOGLE_CLIENT_SECRET"                     = var.GOOGLE_CLIENT_SECRET
    "GOOGLE_OIDC_REDIRECT_URL"                 = var.GOOGLE_OIDC_REDIRECT_URL
    "RATE_LIMITING_BASE_LIMIT"                 = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                   = var.RATE_LIMITING_BASE_TTL
  }

  depends_on = [
    kubernetes_service.pooler,
    kubernetes_service.pubsub,
  ]
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
    "ALERTS_SERVICE_ENABLED"                   = "true"
    "PORT"                                     = var.BACKEND_PORT
    "APP_NAME"                                 = var.APP_NAME
    "DATABASE_LOGGING_ENABLED"                 = var.DATABASE_LOGGING_ENABLED
    "EVENTS_ENCRYPTION_SECRET_64_BYTES"        = var.EVENTS_ENCRYPTION_SECRET_64_BYTES
    "CLIENT_URL_BASE"                          = var.CLIENT_URL_BASE
    "DATABASE_PORT"                            = var.DATABASE_PORT
    "DATABASE_USERNAME"                        = var.DATABASE_USERNAME
    "DATABASE_PASSWORD"                        = var.DATABASE_PASSWORD
    "DATABASE_HOST"                            = "${kubernetes_service.pooler.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
    "PUBSUB_HOST"                              = "${kubernetes_service.pubsub.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
    "PUBSUB_PORT"                              = var.PUBSUB_PORT
    "JWT_SIGNING_SECRET"                       = var.JWT_SIGNING_SECRET
    "OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS"   = var.OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS
    "JWT_EXPIRATION_TIME_IN_SECONDS"           = var.JWT_EXPIRATION_TIME_IN_SECONDS
    "REFRESH_TOKEN_SIGNING_SECRET"             = var.REFRESH_TOKEN_SIGNING_SECRET
    "REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS" = var.REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS
    "AUTH_DATABASE_NAME"                       = var.AUTH_DATABASE_NAME
    "AUTH_THROTTLE_LIMIT"                      = var.AUTH_THROTTLE_LIMIT
    "AUTH_THROTTLE_TTL_IN_MS"                  = var.AUTH_THROTTLE_TTL_IN_MS
    "USERS_DATABASE_NAME"                      = var.USERS_DATABASE_NAME
    "JOURNAL_DATABASE_NAME"                    = var.JOURNAL_DATABASE_NAME
    "ALERTS_DATABASE_NAME"                     = var.ALERTS_DATABASE_NAME
    "GDPR_DATABASE_NAME"                       = var.GDPR_DATABASE_NAME
    "MAIL_DATABASE_NAME"                       = var.MAIL_DATABASE_NAME
    "MAIL_SENDER_NAME"                         = var.MAIL_SENDER_NAME
    "MAIL_SENDER_USER"                         = var.MAIL_SENDER_USER
    "MAIL_SENDER_PASSWORD"                     = var.MAIL_SENDER_PASSWORD
    "MAIL_SENDER_HOST"                         = var.MAIL_SENDER_HOST
    "MAIL_SENDER_PORT"                         = var.MAIL_SENDER_PORT
    "MAIL_DEBUG_MODE"                          = var.MAIL_DEBUG_MODE
    "COOKIES_SECRET"                           = var.COOKIES_SECRET
    "GOOGLE_CLIENT_ID"                         = var.GOOGLE_CLIENT_ID
    "GOOGLE_CLIENT_SECRET"                     = var.GOOGLE_CLIENT_SECRET
    "GOOGLE_OIDC_REDIRECT_URL"                 = var.GOOGLE_OIDC_REDIRECT_URL
    "RATE_LIMITING_BASE_LIMIT"                 = var.RATE_LIMITING_BASE_LIMIT
    "RATE_LIMITING_BASE_TTL"                   = var.RATE_LIMITING_BASE_TTL
  }

  depends_on = [
    kubernetes_service.pooler,
    kubernetes_service.pubsub,
  ]
}
