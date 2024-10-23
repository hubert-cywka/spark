variable "DATABASE_PORT" {
    type        = number
}

variable "DATABASE_USERNAME" {
    type        = string
}

variable "DATABASE_PASSWORD" {
    type        = string
}

variable "APP_URL" {
    type        = string
}

variable "REDIS_PORT" {
    type        = number
}

variable "AUTHENTICATION_SERVICE_PORT" {
    type        = number
}

variable "AUTHENTICATION_SERVICE_DATABASE_NAME" {
    type        = string
}

variable "AUTHENTICATION_SERVICE_JWT_SIGNING_SECRET" {
    type        = string
}

variable "AUTHENTICATION_SERVICE_JWT_EXPIRATION_TIME_IN_SECONDS" {
    type        = number
}

variable "AUTHENTICATION_SERVICE_REFRESH_TOKEN_SIGNING_SECRET" {
    type        = string
}

variable "AUTHENTICATION_SERVICE_REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS" {
    type        = number
}

variable "AUTHENTICATION_SERVICE_THROTTLE_TTL_IN_MS" {
    type        = number
}

variable "AUTHENTICATION_SERVICE_THROTTLE_LIMIT" {
    type        = number
}

variable "USERS_SERVICE_PORT" {
    type        = number
}

variable "USERS_SERVICE_DATABASE_NAME" {
    type        = string
}

variable "STITCHING_SERVICE_PORT" {
    type        = number
}

variable "UI_SERVICE_PORT" {
    type        = number
}

variable "UI_SERVICE_STATIC_FILES_DIR" {
    type        = string
}

variable "PROXY_SERVICE_PORT" {
    type        = number
}

variable "PROXY_SERVICE_ALLOWED_ORIGINS" {
    type        = string
}

variable "MAILING_SERVICE_PORT" {
    type        = number
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
    type        = number
}

variable "MAILING_SERVICE_DEBUG_MODE" {
    type        = string
}
