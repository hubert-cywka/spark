resource "kubernetes_deployment" "backend" {
    metadata {
        name      = "backend"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        replicas = 1

        selector {
            match_labels = {
                app = "backend"
            }
        }

        template {
            metadata {
                labels = {
                    app = "backend"
                }
            }

            spec {
                container {
                    name  = "backend"
                    image = "hejs22/codename-backend:latest"

                    port {
                        container_port = var.BACKEND_PORT
                    }

                    env {
                        name  = "PORT"
                        value = var.BACKEND_PORT
                    }

                    env {
                        name  = "CLIENT_URL_BASE"
                        value = var.CLIENT_URL_BASE
                    }
                    env {
                        name  = "CLIENT_ACCOUNT_ACTIVATION_PAGE"
                        value = var.CLIENT_ACCOUNT_ACTIVATION_PAGE
                    }
                    env {
                        name  = "CLIENT_FORGOT_PASSWORD_PAGE"
                        value = var.CLIENT_FORGOT_PASSWORD_PAGE
                    }
                    env {
                        name  = "CLIENT_OIDC_LOGIN_PAGE"
                        value = var.CLIENT_OIDC_LOGIN_PAGE
                    }
                    env {
                        name  = "CLIENT_OIDC_REGISTER_PAGE"
                        value = var.CLIENT_OIDC_REGISTER_PAGE
                    }

                    env {
                        name  = "DATABASE_PORT"
                        value = var.DATABASE_PORT
                    }
                    env {
                        name  = "DATABASE_USERNAME"
                        value = var.DATABASE_USERNAME
                    }
                    env {
                        name  = "DATABASE_PASSWORD"
                        value = var.DATABASE_PASSWORD
                    }
                    env {
                        name  = "DATABASE_HOST"
                        value = "${kubernetes_service.db.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
                    }

                    env {
                        name  = "PUBSUB_HOST"
                        value = "${kubernetes_service.pubsub.metadata[0].name}.${kubernetes_namespace.codename.metadata[0].name}.svc.cluster.local"
                    }
                    env {
                        name  = "PUBSUB_PORT"
                        value = var.PUBSUB_PORT
                    }

                    env {
                        name  = "JWT_SIGNING_SECRET"
                        value = var.JWT_SIGNING_SECRET
                    }
                    env {
                        name  = "JWT_EXPIRATION_TIME_IN_SECONDS"
                        value = var.JWT_EXPIRATION_TIME_IN_SECONDS
                    }
                    env {
                        name  = "REFRESH_TOKEN_SIGNING_SECRET"
                        value = var.REFRESH_TOKEN_SIGNING_SECRET
                    }
                    env {
                        name  = "REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS"
                        value = var.REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS
                    }

                    env {
                        name  = "AUTH_DATABASE_NAME"
                        value = var.AUTH_DATABASE_NAME
                    }
                    env {
                        name  = "AUTH_THROTTLE_LIMIT"
                        value = var.AUTH_THROTTLE_LIMIT
                    }
                    env {
                        name  = "AUTH_THROTTLE_TTL_IN_MS"
                        value = var.AUTH_THROTTLE_TTL_IN_MS
                    }

                    env {
                        name  = "USERS_DATABASE_NAME"
                        value = var.USERS_DATABASE_NAME
                    }

                    env {
                        name  = "JOURNAL_DATABASE_NAME"
                        value = var.JOURNAL_DATABASE_NAME
                    }

                    env {
                        name  = "ALERTS_DATABASE_NAME"
                        value = var.ALERTS_DATABASE_NAME
                    }

                    env {
                        name  = "GDPR_DATABASE_NAME"
                        value = var.GDPR_DATABASE_NAME
                    }
                    
                    env {
                        name  = "MAIL_DATABASE_NAME"
                        value = var.MAIL_DATABASE_NAME
                    }

                    env {
                        name  = "MAIL_SENDER_NAME"
                        value = var.MAIL_SENDER_NAME
                    }
                    env {
                        name  = "MAIL_SENDER_USER"
                        value = var.MAIL_SENDER_USER
                    }
                    env {
                        name  = "MAIL_SENDER_PASSWORD"
                        value = var.MAIL_SENDER_PASSWORD
                    }
                    env {
                        name  = "MAIL_SENDER_HOST"
                        value = var.MAIL_SENDER_HOST
                    }
                    env {
                        name  = "MAIL_SENDER_PORT"
                        value = var.MAIL_SENDER_PORT
                    }
                    env {
                        name  = "MAIL_DEBUG_MODE"
                        value = var.MAIL_DEBUG_MODE
                    }

                    env {
                        name  = "COOKIES_SECRET"
                        value = var.COOKIES_SECRET
                    }

                    env {
                        name  = "GOOGLE_CLIENT_ID"
                        value = var.GOOGLE_CLIENT_ID
                    }
                    env {
                        name  = "GOOGLE_CLIENT_SECRET"
                        value = var.GOOGLE_CLIENT_SECRET
                    }
                    env {
                        name  = "GOOGLE_OIDC_REDIRECT_URL"
                        value = var.GOOGLE_OIDC_REDIRECT_URL
                    }

                    env {
                        name = "RATE_LIMITING_BASE_LIMIT"
                        value = var.RATE_LIMITING_BASE_LIMIT
                    }
                    env {
                        name = "RATE_LIMITING_BASE_TTL"
                        value = var.RATE_LIMITING_BASE_TTL
                    }
                }
            }
        }
    }
    depends_on = [kubernetes_deployment.db, kubernetes_deployment.pubsub]
}

resource "kubernetes_service" "backend" {
    metadata {
        name      = "backend"
        namespace = kubernetes_namespace.codename.metadata[0].name
    }

    spec {
        selector = {
            app = kubernetes_deployment.backend.spec[0].template[0].metadata[0].labels.app
        }

        port {
            port = var.BACKEND_PORT
        }

        type = "ClusterIP"
    }
}
