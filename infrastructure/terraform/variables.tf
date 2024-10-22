variable "DATABASE_PORT" {
    type        = string
}

variable "DATABASE_USERNAME" {
    type        = string
}

variable "DATABASE_PASSWORD" {
    type        = string
}

variable "DATABASE_HOST" {
    type        = string
}

variable "APP_URL" {
    type        = string
}

variable "REDIS_HOST" {
    type        = string
}

variable "REDIS_PORT" {
    type        = string
}

variable "AUTHENTICATION_SERVICE_INTERNAL_PORT" {
    type        = string
}

variable "AUTHENTICATION_SERVICE_EXTERNAL_PORT" {
    type        = string
}

variable "AUTHENTICATION_SERVICE_HOST" {
    type        = string
}

variable "AUTHENTICATION_SERVICE_DATABASE_NAME" {
    type        = string
}

variable "AUTHENTICATION_SERVICE_JWT_SIGNING_SECRET" {
    type        = string
}

variable "AUTHENTICATION_SERVICE_JWT_EXPIRATION_TIME_IN_SECONDS" {
    type        = string
}

variable "AUTHENTICATION_SERVICE_REFRESH_TOKEN_SIGNING_SECRET" {
    type        = string
}

variable "AUTHENTICATION_SERVICE_REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS" {
    type        = string
}

variable "AUTHENTICATION_SERVICE_THROTTLE_TTL_IN_MS" {
    type        = string
}

variable "AUTHENTICATION_SERVICE_THROTTLE_LIMIT" {
    type        = string
}

variable "USERS_SERVICE_INTERNAL_PORT" {
    type        = string
}

variable "USERS_SERVICE_EXTERNAL_PORT" {
    type        = string
}

variable "USERS_SERVICE_HOST" {
    type        = string
}

variable "USERS_SERVICE_DATABASE_NAME" {
    type        = string
}

variable "STITCHING_SERVICE_INTERNAL_PORT" {
    type        = string
}

variable "STITCHING_SERVICE_EXTERNAL_PORT" {
    type        = string
}

variable "STITCHING_SERVICE_HOST" {
    type        = string
}

variable "UI_SERVICE_INTERNAL_PORT" {
    type        = string
}

variable "UI_SERVICE_EXTERNAL_PORT" {
    type        = string
}

variable "UI_SERVICE_HOST" {
    type        = string
}

variable "UI_SERVICE_STATIC_FILES_DIR" {
    type        = string
}

variable "PROXY_SERVICE_INTERNAL_PORT" {
    type        = string
}

variable "PROXY_SERVICE_EXTERNAL_PORT" {
    type        = string
}

variable "PROXY_SERVICE_ALLOWED_ORIGINS" {
    type        = string
}

variable "MAILING_SERVICE_INTERNAL_PORT" {
    type        = string
}

variable "MAILING_SERVICE_EXTERNAL_PORT" {
    type        = string
}

variable "MAILING_SERVICE_SENDER_NAME" {
    type        = string
}

variable "MAILING_SERVICE_SENDER_USER" {
    type        = string
}

variable "MAILING_SERVICE_SENDER_PASSWORD" {
    type        = string
}

variable "MAILING_SERVICE_SENDER_HOST" {
    type        = string
}

variable "MAILING_SERVICE_SENDER_PORT" {
    type        = string
}

variable "MAILING_SERVICE_DEBUG_MODE" {
    type        = string
}
