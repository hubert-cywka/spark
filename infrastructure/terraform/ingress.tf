resource "kubernetes_ingress_v1" "ingress" {
    metadata {
        name      = "ingress"
        namespace = kubernetes_namespace.codename.metadata[0].name

        annotations = {
            "nginx.ingress.kubernetes.io/rewrite-target" = "/"
        }
    }

    spec {
        ingress_class_name = "nginx"

        rule {
            http {
                path {
                    path = "/"
                    path_type = "Prefix"

                    backend {
                        service {
                            name = kubernetes_service.gateway.metadata[0].name
                            port {
                                number = var.GATEWAY_PORT
                            }
                        }
                    }
                }
            }
        }
    }
}
