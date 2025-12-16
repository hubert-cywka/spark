resource "kubernetes_deployment" "tempo" {
  metadata {
    name      = "tempo"
    namespace = var.namespace
    labels    = { app = "tempo" }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "tempo"
      }
    }

    template {
      metadata {
        labels = {
          app = "tempo"
        }
      }

      spec {
        security_context {
          fs_group = 10001
        }

        container {
          name  = "tempo"
          image = "grafana/tempo:${var.tempo_image_tag}"

          command = [
            "/tempo",
            "--config.file=/etc/tempo.yaml"
          ]

          port {
            name           = "http-web"
            container_port = var.tempo_http_port
          }
          port {
            name           = "grpc-otlp"
            container_port = var.tempo_grpc_port
          }
          port {
            name           = "http-otlp"
            container_port = var.tempo_http_port_otlp
          }

          volume_mount {
            mount_path = "/etc/tempo.yaml"
            sub_path   = "tempo.yaml"
            name       = "config-volume"
            read_only  = true
          }

          volume_mount {
            mount_path = "/var/tempo"
            name       = "tempo-storage"
          }
        }

        volume {
          name = "config-volume"
          config_map {
            name = kubernetes_config_map.tempo_config.metadata[0].name
          }
        }
        volume {
          name = "tempo-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.tempo_pvc.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "tempo" {
  metadata {
    name      = "tempo"
    namespace = var.namespace
    labels    = { app = "tempo" }
  }

  spec {
    selector = {
      app = kubernetes_deployment.tempo.metadata[0].labels.app
    }

    port {
      port        = var.tempo_http_port
      target_port = 3200
      protocol    = "TCP"
      name        = "http-web"
    }
    port {
      port        = var.tempo_grpc_port
      target_port = 4317
      protocol    = "TCP"
      name        = "grpc-otlp"
    }
    port {
      port        = var.tempo_http_port_otlp
      target_port = 4318
      protocol    = "TCP"
      name        = "http-otlp"
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_config_map" "tempo_config" {
  metadata {
    name      = "tempo-config"
    namespace = var.namespace
  }

  data = {
    "tempo.yaml" = <<EOF
server:
  http_listen_port: ${var.tempo_http_port}

distributor:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: "0.0.0.0:${var.tempo_grpc_port}"
        http:
          endpoint: "0.0.0.0:${var.tempo_http_port_otlp}"

storage:
  trace:
    backend: local
    wal:
      path: /var/tempo/wal
    local:
      path: /var/tempo/blocks

overrides:
  metrics_generator_processors: [service-graphs, span-metrics]
EOF
  }
}

resource "kubernetes_persistent_volume_claim" "tempo_pvc" {
  metadata {
    name      = "tempo-pvc"
    namespace = var.namespace
  }

  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = var.tempo_volume_size_request
      }
    }
    storage_class_name = "standard"
  }
}