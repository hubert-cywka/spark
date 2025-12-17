resource "kubernetes_secret_v1" "app_secrets" {
  metadata {
    name      = "app-secrets"
    namespace = kubernetes_namespace_v1.app.metadata[0].name
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