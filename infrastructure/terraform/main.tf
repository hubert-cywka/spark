// TODO: Split terraform into modules

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
        DATABASE_PORT                                       = var.DATABASE_PORT
        DATABASE_USERNAME                                   = var.DATABASE_USERNAME
        DATABASE_PASSWORD                                   = var.DATABASE_PASSWORD

        CLIENT_URL_BASE                                     = var.CLIENT_URL_BASE
        CLIENT_OIDC_LOGIN_PAGE                              = var.CLIENT_OIDC_LOGIN_PAGE
        CLIENT_OIDC_REGISTER_PAGE                           = var.CLIENT_OIDC_REGISTER_PAGE

        CLIENT_FORGOT_PASSWORD_PAGE                         = var.CLIENT_FORGOT_PASSWORD_PAGE
        CLIENT_ACCOUNT_ACTIVATION_PAGE                      = var.CLIENT_ACCOUNT_ACTIVATION_PAGE

        PUBSUB_PORT                                         = var.PUBSUB_PORT

        BACKEND_PORT                                        = var.BACKEND_PORT
        JWT_SIGNING_SECRET                                  = var.JWT_SIGNING_SECRET
        JWT_EXPIRATION_TIME_IN_SECONDS                      = var.JWT_EXPIRATION_TIME_IN_SECONDS
        REFRESH_TOKEN_SIGNING_SECRET                        = var.REFRESH_TOKEN_SIGNING_SECRET
        REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS            = var.REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS

        AUTH_DATABASE_NAME                                  = var.AUTH_DATABASE_NAME
        AUTH_THROTTLE_TTL_IN_MS                             = var.AUTH_THROTTLE_TTL_IN_MS
        AUTH_THROTTLE_LIMIT                                 = var.AUTH_THROTTLE_LIMIT

        USERS_DATABASE_NAME                                 = var.USERS_DATABASE_NAME

        FRONTEND_PORT                                       = var.FRONTEND_PORT

        GATEWAY_PORT                                        = var.GATEWAY_PORT
        GATEWAY_ALLOWED_ORIGINS                             = var.GATEWAY_ALLOWED_ORIGINS
        GATEWAY_URL                                         = var.GATEWAY_URL

        MAIL_SENDER_PORT                                    = var.MAIL_SENDER_PORT
        MAIL_SENDER_NAME                                    = var.MAIL_SENDER_NAME
        MAIL_SENDER_USER                                    = var.MAIL_SENDER_USER
        MAIL_SENDER_PASSWORD                                = var.MAIL_SENDER_PASSWORD
        MAIL_SENDER_PORT                                    = var.MAIL_SENDER_PORT
        MAIL_DEBUG_MODE                                     = var.MAIL_DEBUG_MODE

        GOOGLE_CLIENT_ID                                    = var.GOOGLE_CLIENT_ID
        GOOGLE_CLIENT_SECRET                                = var.GOOGLE_CLIENT_SECRET
        GOOGLE_OIDC_REDIRECT_URL                            = var.GOOGLE_OIDC_REDIRECT_URL

        COOKIES_SECRET                                      = var.COOKIES_SECRET
    }
}

