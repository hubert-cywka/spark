variable "APP_NAME" {
  type = string
}

variable "EVENTS_ENCRYPTION_SECRET_64_BYTES" {
  type = string
}

variable "RATE_LIMITING_BASE_TTL" {
  type = number
}

variable "RATE_LIMITING_BASE_LIMIT" {
  type = number
}

variable "DATABASE_LOGGING_ENABLED" {
  type = string
}

variable "DATABASE_PORT" {
  type = number
}

variable "DATABASE_USERNAME" {
  type = string
}

variable "DATABASE_PASSWORD" {
  sensitive = true
  type      = string
}

variable "CLIENT_URL_BASE" {
  type = string
}

variable "BACKEND_PORT" {
  type = number
}

variable "FRONTEND_PORT" {
  type = number
}

variable "GATEWAY_PORT" {
  type = number
}

variable "GATEWAY_URL" {
  type = string
}

variable "AUTH_DATABASE_NAME" {
  type = string
}

variable "JWT_SIGNING_SECRET" {
  sensitive = true
  type      = string
}

variable "OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS" {
  type = number
}

variable "JWT_EXPIRATION_TIME_IN_SECONDS" {
  type = number
}

variable "REFRESH_TOKEN_SIGNING_SECRET" {
  sensitive = true
  type      = string
}

variable "REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS" {
  type = number
}

variable "AUTH_THROTTLE_TTL_IN_MS" {
  type = number
}

variable "AUTH_THROTTLE_LIMIT" {
  type = number
}

variable "USERS_DATABASE_NAME" {
  type = string
}

variable "JOURNAL_DATABASE_NAME" {
  type = string
}

variable "ALERTS_DATABASE_NAME" {
  type = string
}

variable "GDPR_DATABASE_NAME" {
  type = string
}

variable "MAIL_DATABASE_NAME" {
  type = string
}

variable "ALLOWED_ORIGINS" {
  type = string
}

variable "MAIL_SENDER_NAME" {
  type = string
}

variable "MAIL_SENDER_USER" {
  type = string
}

variable "MAIL_SENDER_PASSWORD" {
  sensitive = true
  type      = string
}

variable "MAIL_SENDER_HOST" {
  type = string
}

variable "MAIL_SENDER_PORT" {
  type = number
}

variable "MAIL_DEBUG_MODE" {
  type = string
}

variable "GOOGLE_CLIENT_ID" {
  type = string
}

variable "GOOGLE_CLIENT_SECRET" {
  sensitive = true
  type      = string
}

variable "GOOGLE_OIDC_REDIRECT_URL" {
  type = string
}

variable "COOKIES_SECRET" {
  sensitive = true
  type      = string
}

variable "PGBOUNCER_POOL_MODE" {
  type = string
}

variable "PGBOUNCER_QUERY_WAIT_TIMEOUT" {
  type = number
}

variable "PGBOUNCER_MAX_CLIENT_CONN" {
  type = number
}

variable "PGBOUNCER_DEFAULT_POOL_SIZE" {
  type = number
}

variable "PGBOUNCER_STATS_USERS" {
  type = string
}

variable "PGBOUNCER_DATABASE" {
  type = string
}

variable "POSTGRESQL_PORT" {
  type = number
}

variable "KAFKA_CLUSTER_ID" {
  type = string
}

variable "KAFKA_NUM_PARTITIONS" {
  type = number
}

variable "KAFKA_BROKER_INTERNAL_PORT" {
  type = number
}

variable "KAFKA_CONTROLLER_INTERNAL_PORT" {
  type = number
}

variable "KAFKA_LOG_SEGMENT_BYTES" {
  type = number
}

variable "PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL" {
  type = number
}

variable "PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS" {
  type = number
}

variable "PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL" {
  type = number
}

variable "PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE" {
  type = number
}

variable "PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL" {
  type = number
}

variable "PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS" {
  type = number
}

variable "PUBSUB_PARTITIONS_NUM_OF_PARTITIONS" {
  type = number
}

variable "PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS" {
  type = number
}

variable "PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH" {
  type = number
}

variable "PUBSUB_CONSUMER_CONCURRENT_PARTITIONS" {
  type = number
}

variable "PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE" {
  type = number
}

variable "PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL" {
  type = number
}

variable "PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS" {
  type = number
}
