resource "kubernetes_config_map_v1" "grafana_datasources" {
  metadata {
    name      = "grafana-datasources"
    namespace = var.namespace
  }

  data = {
    "datasources.yaml" = templatefile("${path.module}/config/grafana/datasources.yaml.tftpl", {
      namespace           = var.namespace
      tempo_http_port     = var.tempo_http_port
      prometheus_web_port = var.prometheus_web_port
    })
  }
}

resource "kubernetes_config_map_v1" "grafana_dashboard_provisioning" {
  metadata {
    name      = "grafana-dashboard-provisioning"
    namespace = var.namespace
  }
  data = {
    "dashboard.yaml" = templatefile("${path.module}/config/grafana/dashboard.yaml.tftpl", {})
  }
}

resource "kubernetes_config_map_v1" "tempo_dashboard" {
  metadata {
    name      = "grafana-tempo-dashboard-json"
    namespace = var.namespace
    labels = {
      grafana_dashboard = "1"
    }
  }

  data = {
    "tempo-traces-dashboard.json" = file("${path.module}/config/grafana/dashboards/tempo_traces.json")
  }
}

resource "kubernetes_persistent_volume_claim_v1" "grafana_pvc" {
  metadata {
    name      = "grafana-pvc"
    namespace = var.namespace
  }

  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = var.grafana_volume_size_request
      }
    }
    storage_class_name = "standard"
  }
}


resource "kubernetes_deployment_v1" "grafana" {
  metadata {
    name      = "grafana"
    namespace = var.namespace
    labels    = { app = "grafana" }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "grafana"
      }
    }

    template {
      metadata {
        labels = {
          app = "grafana"
        }
      }

      spec {
        container {
          name  = "grafana"
          image = "grafana/grafana:${var.grafana_image_tag}"

          env {
            name  = "GF_SECURITY_ADMIN_USER"
            value = var.grafana_admin_user
          }
          env {
            name  = "GF_SECURITY_ADMIN_PASSWORD"
            value = var.grafana_admin_password
          }

          port {
            container_port = var.grafana_port
          }

          volume_mount {
            name       = "grafana-datasources"
            mount_path = "/etc/grafana/provisioning/datasources"
            read_only  = true
          }
          volume_mount {
            name       = "grafana-dashboard-provisioning"
            mount_path = "/etc/grafana/provisioning/dashboards"
            read_only  = true
          }
          volume_mount {
            name       = "tempo-dashboard-json"
            mount_path = "/etc/grafana/provisioning/dashboards/custom-dashboards"
            read_only  = true
          }

          volume_mount {
            mount_path = "/var/lib/grafana"
            name       = "grafana-storage"
          }
        }

        volume {
          name = "grafana-datasources"
          config_map {
            name = kubernetes_config_map_v1.grafana_datasources.metadata[0].name
          }
        }
        volume {
          name = "grafana-dashboard-provisioning"
          config_map {
            name = kubernetes_config_map_v1.grafana_dashboard_provisioning.metadata[0].name
          }
        }
        volume {
          name = "tempo-dashboard-json"
          config_map {
            name = kubernetes_config_map_v1.tempo_dashboard.metadata[0].name
          }
        }
        volume {
          name = "grafana-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim_v1.grafana_pvc.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "grafana" {
  metadata {
    name      = "grafana"
    namespace = var.namespace
    labels    = { app = "grafana" }
  }

  spec {
    selector = {
      app = kubernetes_deployment_v1.grafana.metadata[0].labels.app
    }

    port {
      port        = var.grafana_port
      target_port = 3000
      protocol    = "TCP"
      name        = "web"
    }

    type = "ClusterIP"
  }
}