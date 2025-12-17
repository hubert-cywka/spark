resource "kubernetes_deployment_v1" "otel_collector" {
  metadata {
    name      = "otel-collector"
    namespace = var.namespace
    labels    = { app = "otel-collector" }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "otel-collector"
      }
    }

    template {
      metadata {
        labels = {
          app = "otel-collector"
        }
      }

      spec {
        container {
          name  = "otel-collector"
          image = "otel/opentelemetry-collector-contrib:${var.otel_collector_image_tag}"

          command = [
            "/otelcol-contrib",
            "--config=/etc/otel-collector-config.yml"
          ]

          port {
            name           = "grpc-otlp"
            container_port = var.otel_grpc_port
          }
          port {
            name           = "http-otlp"
            container_port = var.otel_http_port
          }
          port {
            name           = "metrics-exp"
            container_port = var.otel_metrics_port
          }

          volume_mount {
            mount_path = "/etc/otel-collector-config.yml"
            sub_path   = "otel-collector-config.yml"
            name       = "config-volume"
            read_only  = true
          }
        }

        volume {
          name = "config-volume"
          config_map {
            name = kubernetes_config_map_v1.otel_collector_config.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "otel_collector" {
  metadata {
    name      = "otel-collector"
    namespace = var.namespace
    labels    = { app = "otel-collector" }
  }

  spec {
    selector = {
      app = kubernetes_deployment_v1.otel_collector.metadata[0].labels.app
    }

    port {
      port        = var.otel_grpc_port
      target_port = 4317
      protocol    = "TCP"
      name        = "grpc-otlp"
    }
    port {
      port        = var.otel_http_port
      target_port = 4318
      protocol    = "TCP"
      name        = "http-otlp"
    }
    port {
      port        = var.otel_metrics_port
      target_port = 8889
      protocol    = "TCP"
      name        = "metrics-exp"
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_config_map_v1" "otel_collector_config" {
  metadata {
    name      = "otel-collector-config"
    namespace = var.namespace
  }

  data = {
    "otel-collector-config.yml" = templatefile("${path.module}/config/otel_collector/otel-collector-config.yml.tpl", {
      namespace           = var.namespace
      tempo_grpc_port     = var.tempo_grpc_port
      prometheus_web_port = var.prometheus_web_port
    })
  }
}