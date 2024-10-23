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
        DATABASE_PORT                                                       = var.DATABASE_PORT
        DATABASE_USERNAME                                                   = var.DATABASE_USERNAME
        DATABASE_PASSWORD                                                   = var.DATABASE_PASSWORD

        APP_URL                                                             = var.APP_URL

        REDIS_PORT                                                          = var.REDIS_PORT

        AUTHENTICATION_SERVICE_PORT                                         = var.AUTHENTICATION_SERVICE_PORT
        AUTHENTICATION_SERVICE_DATABASE_NAME                                = var.AUTHENTICATION_SERVICE_DATABASE_NAME
        AUTHENTICATION_SERVICE_JWT_SIGNING_SECRET                           = var.AUTHENTICATION_SERVICE_JWT_SIGNING_SECRET
        AUTHENTICATION_SERVICE_JWT_EXPIRATION_TIME_IN_SECONDS               = var.AUTHENTICATION_SERVICE_JWT_EXPIRATION_TIME_IN_SECONDS
        AUTHENTICATION_SERVICE_REFRESH_TOKEN_SIGNING_SECRET                 = var.AUTHENTICATION_SERVICE_REFRESH_TOKEN_SIGNING_SECRET
        AUTHENTICATION_SERVICE_REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS     = var.AUTHENTICATION_SERVICE_REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS
        AUTHENTICATION_SERVICE_THROTTLE_TTL_IN_MS                           = var.AUTHENTICATION_SERVICE_THROTTLE_TTL_IN_MS
        AUTHENTICATION_SERVICE_THROTTLE_LIMIT                               = var.AUTHENTICATION_SERVICE_THROTTLE_LIMIT

        USERS_SERVICE_PORT                                                  = var.USERS_SERVICE_PORT
        USERS_SERVICE_DATABASE_NAME                                         = var.USERS_SERVICE_DATABASE_NAME

        STITCHING_SERVICE_PORT                                              = var.STITCHING_SERVICE_PORT

        UI_SERVICE_PORT                                                     = var.UI_SERVICE_PORT
        UI_SERVICE_STATIC_FILES_DIR                                         = var.UI_SERVICE_STATIC_FILES_DIR

        PROXY_SERVICE_PORT                                                  = var.PROXY_SERVICE_PORT
        PROXY_SERVICE_ALLOWED_ORIGINS                                       = var.PROXY_SERVICE_ALLOWED_ORIGINS

        MAILING_SERVICE_SENDER_HOST                                         = var.MAILING_SERVICE_SENDER_HOST
        MAILING_SERVICE_PORT                                                = var.MAILING_SERVICE_PORT
        MAILING_SERVICE_SENDER_NAME                                         = var.MAILING_SERVICE_SENDER_NAME
        MAILING_SERVICE_SENDER_USER                                         = var.MAILING_SERVICE_SENDER_USER
        MAILING_SERVICE_SENDER_PASSWORD                                     = var.MAILING_SERVICE_SENDER_PASSWORD
        MAILING_SERVICE_SENDER_PORT                                         = var.MAILING_SERVICE_SENDER_PORT
        MAILING_SERVICE_DEBUG_MODE                                          = var.MAILING_SERVICE_DEBUG_MODE
    }
}

