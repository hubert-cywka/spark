// TODO: Split terraform into modules

provider "kubernetes" {
    config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "app_namespace" {
    metadata {
        name = "codename"
    }
}

resource "kubernetes_config_map" "app_config" {
    metadata {
        name      = "app-config"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    data = {
        DATABASE_PORT                                                       = var.DATABASE_PORT
        DATABASE_USERNAME                                                   = var.DATABASE_USERNAME
        DATABASE_PASSWORD                                                   = var.DATABASE_PASSWORD
        DATABASE_HOST                                                       = var.DATABASE_HOST

        APP_URL                                                             = var.APP_URL

        REDIS_HOST                                                          = var.REDIS_HOST
        REDIS_PORT                                                          = var.REDIS_PORT

        AUTHENTICATION_SERVICE_INTERNAL_PORT                                = var.AUTHENTICATION_SERVICE_INTERNAL_PORT
        AUTHENTICATION_SERVICE_EXTERNAL_PORT                                = var.AUTHENTICATION_SERVICE_EXTERNAL_PORT
        AUTHENTICATION_SERVICE_HOST                                         = var.AUTHENTICATION_SERVICE_HOST
        AUTHENTICATION_SERVICE_DATABASE_NAME                                = var.AUTHENTICATION_SERVICE_DATABASE_NAME
        AUTHENTICATION_SERVICE_JWT_SIGNING_SECRET                           = var.AUTHENTICATION_SERVICE_JWT_SIGNING_SECRET
        AUTHENTICATION_SERVICE_JWT_EXPIRATION_TIME_IN_SECONDS               = var.AUTHENTICATION_SERVICE_JWT_EXPIRATION_TIME_IN_SECONDS
        AUTHENTICATION_SERVICE_REFRESH_TOKEN_SIGNING_SECRET                 = var.AUTHENTICATION_SERVICE_REFRESH_TOKEN_SIGNING_SECRET
        AUTHENTICATION_SERVICE_REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS     = var.AUTHENTICATION_SERVICE_REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS
        AUTHENTICATION_SERVICE_THROTTLE_TTL_IN_MS                           = var.AUTHENTICATION_SERVICE_THROTTLE_TTL_IN_MS
        AUTHENTICATION_SERVICE_THROTTLE_LIMIT                               = var.AUTHENTICATION_SERVICE_THROTTLE_LIMIT

        USERS_SERVICE_INTERNAL_PORT                                         = var.USERS_SERVICE_INTERNAL_PORT
        USERS_SERVICE_EXTERNAL_PORT                                         = var.USERS_SERVICE_EXTERNAL_PORT
        USERS_SERVICE_HOST                                                  = var.USERS_SERVICE_HOST
        USERS_SERVICE_DATABASE_NAME                                         = var.USERS_SERVICE_DATABASE_NAME

        STITCHING_SERVICE_INTERNAL_PORT                                     = var.STITCHING_SERVICE_INTERNAL_PORT
        STITCHING_SERVICE_EXTERNAL_PORT                                     = var.STITCHING_SERVICE_EXTERNAL_PORT
        STITCHING_SERVICE_HOST                                              = var.STITCHING_SERVICE_HOST

        UI_SERVICE_INTERNAL_PORT                                            = var.UI_SERVICE_INTERNAL_PORT
        UI_SERVICE_EXTERNAL_PORT                                            = var.UI_SERVICE_EXTERNAL_PORT
        UI_SERVICE_HOST                                                     = var.UI_SERVICE_HOST
        UI_SERVICE_STATIC_FILES_DIR                                         = var.UI_SERVICE_STATIC_FILES_DIR

        PROXY_SERVICE_INTERNAL_PORT                                         = var.PROXY_SERVICE_INTERNAL_PORT
        PROXY_SERVICE_EXTERNAL_PORT                                         = var.PROXY_SERVICE_EXTERNAL_PORT
        PROXY_SERVICE_ALLOWED_ORIGINS                                       = var.PROXY_SERVICE_ALLOWED_ORIGINS

        MAILING_SERVICE_INTERNAL_PORT                                       = var.MAILING_SERVICE_INTERNAL_PORT
        MAILING_SERVICE_EXTERNAL_PORT                                       = var.MAILING_SERVICE_EXTERNAL_PORT
        MAILING_SERVICE_SENDER_NAME                                         = var.MAILING_SERVICE_SENDER_NAME
        MAILING_SERVICE_SENDER_USER                                         = var.MAILING_SERVICE_SENDER_USER
        MAILING_SERVICE_SENDER_PASSWORD                                     = var.MAILING_SERVICE_SENDER_PASSWORD
        MAILING_SERVICE_SENDER_HOST                                         = var.MAILING_SERVICE_SENDER_HOST
        MAILING_SERVICE_SENDER_PORT                                         = var.MAILING_SERVICE_SENDER_PORT
        MAILING_SERVICE_DEBUG_MODE                                          = var.MAILING_SERVICE_DEBUG_MODE
    }
}

resource "kubernetes_persistent_volume" "postgres_volume" {
    metadata {
        name = "postgres-volume"
    }

    spec {
        capacity = {
            storage = "2Gi"
        }
        access_modes = ["ReadWriteOnce"]

        persistent_volume_source {
            host_path {
                path = "/mnt/data/postgres"
            }
        }
    }
}

resource "kubernetes_persistent_volume_claim" "postgres_pvc" {
    metadata {
        name      = "postgres-pvc"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        access_modes = ["ReadWriteOnce"]
        resources {
            requests = {
                storage = "2Gi"
            }
        }
    }
}

resource "kubernetes_persistent_volume" "redis_volume" {
    metadata {
        name = "redis-volume"
    }

    spec {
        capacity = {
            storage = "1Gi"
        }
        access_modes = ["ReadWriteOnce"]

        persistent_volume_source {
            host_path {
                path = "/mnt/data/redis"
            }
        }
    }
}

resource "kubernetes_persistent_volume_claim" "redis_pvc" {
    metadata {
        name      = "redis-pvc"
        namespace = kubernetes_namespace.app_namespace.metadata[0].name
    }

    spec {
        access_modes = ["ReadWriteOnce"]
        resources {
            requests = {
                storage = "1Gi"
            }
        }
    }
}
