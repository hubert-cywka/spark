variable "DATABASE_PORT" {
    type        = number
}

variable "DATABASE_USERNAME" {
    type        = string
}

variable "DATABASE_PASSWORD" {
    type        = string
}

variable "CLIENT_URL_BASE" {
    type        = string
}

variable "CLIENT_ACCOUNT_ACTIVATION_PAGE" {
    type        = string
}

variable "CLIENT_FORGOT_PASSWORD_PAGE" {
    type        = string
}

variable "CLIENT_OIDC_LOGIN_PAGE" {
    type        = string
}

variable "CLIENT_OIDC_REGISTER_PAGE" {
    type        = string
}

variable "PUBSUB_PORT" {
    type        = number
}

variable "BACKEND_PORT" {
    type        = number
}

variable "FRONTEND_PORT" {
    type        = number
}

variable "GATEWAY_PORT" {
    type        = number
}

variable "GATEWAY_URL" {
    type        = string
}

variable "AUTH_DATABASE_NAME" {
    type        = string
}

variable "JWT_SIGNING_SECRET" {
    type        = string
}

variable "JWT_EXPIRATION_TIME_IN_SECONDS" {
    type        = number
}

variable "REFRESH_TOKEN_SIGNING_SECRET" {
    type        = string
}

variable "REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS" {
    type        = number
}

variable "AUTH_THROTTLE_TTL_IN_MS" {
    type        = number
}

variable "AUTH_THROTTLE_LIMIT" {
    type        = number
}

variable "USERS_DATABASE_NAME" {
    type        = string
}

variable "MAIL_DATABASE_NAME" {
    type        = string
}

variable "GATEWAY_ALLOWED_ORIGINS" {
    type        = string
}

variable "MAIL_SENDER_NAME" {
    type        = string
}

variable "MAIL_SENDER_USER" {
    type        = string
}

variable "MAIL_SENDER_PASSWORD" {
    type        = string
}

variable "MAIL_SENDER_HOST" {
    type        = string
}

variable "MAIL_SENDER_PORT" {
    type        = number
}

variable "MAIL_DEBUG_MODE" {
    type        = string
}

variable "GOOGLE_CLIENT_ID" {
    type        = string
}

variable "GOOGLE_CLIENT_SECRET" {
    type        = string
}

variable "GOOGLE_OIDC_REDIRECT_URL" {
    type        = string
}

variable "COOKIES_SECRET" {
    type        = string
}
