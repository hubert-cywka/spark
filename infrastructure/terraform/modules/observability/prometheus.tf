resource "kubernetes_deployment" "prometheus" {
  metadata {
    name      = "prometheus"
    namespace = var.namespace
    labels    = { app = "prometheus" }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "prometheus"
      }
    }

    template {
      metadata {
        labels = {
          app = "prometheus"
        }
      }

      spec {
        container {
          name  = "prometheus"
          image = "prom/prometheus:${var.prometheus_image_tag}"

          command = [
            "/bin/prometheus",
            "--config.file=/etc/prometheus/prometheus.yml",
            "--storage.tsdb.path=/prometheus",
            "--web.console.libraries=/usr/share/prometheus/console_libraries",
            "--web.console.templates=/usr/share/prometheus/consoles"
          ]

          port {
            container_port = var.prometheus_web_port
          }

          volume_mount {
            mount_path = "/etc/prometheus"
            name       = "config-volume"
            read_only  = true
          }

          volume_mount {
            mount_path = "/prometheus"
            name       = "prometheus-storage"
          }
        }

        volume {
          name = "config-volume"
          config_map {
            name = kubernetes_config_map.prometheus_config.metadata[0].name
          }
        }
        volume {
          name = "prometheus-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.prometheus_pvc.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "prometheus" {
  metadata {
    name      = "prometheus"
    namespace = var.namespace
    labels    = { app = "prometheus" }
  }

  spec {
    selector = {
      app = kubernetes_deployment.prometheus.metadata[0].labels.app
    }

    port {
      port        = var.prometheus_web_port
      target_port = 9090
      protocol    = "TCP"
      name        = "web"
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_config_map" "prometheus_config" {
  metadata {
    name      = "prometheus-config"
    namespace = var.namespace
  }

  data = {
    "prometheus.yml" = <<EOF
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: "otel-collector"
    static_configs:
      - targets:
          - "otel-collector:${var.otel_metrics_port}"
EOF
  }
}

resource "kubernetes_persistent_volume_claim" "prometheus_pvc" {
  metadata {
    name      = "prometheus-pvc"
    namespace = var.namespace
  }

  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = var.prometheus_volume_size_request
      }
    }
    storage_class_name = "standard"
  }
}