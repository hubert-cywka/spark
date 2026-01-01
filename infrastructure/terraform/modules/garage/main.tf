resource "kubernetes_config_map_v1" "garage_config" {
  metadata {
    name      = "garage-config"
    namespace = var.namespace
  }

  data = {
    "garage.toml" = templatefile("${path.module}/config/garage.toml.tftpl", {
      namespace          = var.namespace
      service_name       = "garage"
      replication_factor = var.replication_factor
      rpc_secret         = var.rpc_secret
      s3_region          = var.s3_region
      s3_root_domain     = var.s3_root_domain
      web_root_domain    = var.web_root_domain
      admin_token        = var.admin_token
      metrics_token      = var.metrics_token
    })
  }
}

resource "kubernetes_stateful_set_v1" "garage" {
  metadata {
    name      = "garage"
    namespace = var.namespace
    labels    = { app = "garage" }
  }

  spec {
    service_name = "garage"
    replicas     = var.replicas

    selector {
      match_labels = { app = "garage" }
    }

    template {
      metadata {
        labels = { app = "garage" }
      }

      spec {
        security_context {
          fs_group    = 10001
          run_as_user = 10001
        }

        container {
          name  = "garage"
          image = "dxflrs/garage:${var.garage_version}"

          env {
            name = "POD_NAME"
            value_from {
              field_ref {
                field_path = "metadata.name"
              }
            }
          }

          env {
            name  = "GARAGE_RPC_PUBLIC_ADDR"
            value = "$(POD_NAME).garage.${var.namespace}.svc.cluster.local:3901"
          }

          port {
            name           = "s3-api"
            container_port = 3900
          }
          port {
            name           = "rpc"
            container_port = 3901
          }
          port {
            name           = "s3-web"
            container_port = 3902
          }
          port {
            name           = "admin-api"
            container_port = 3903
          }
          port {
            name           = "k2v-api"
            container_port = 3904
          }

          volume_mount {
            name       = "config"
            mount_path = "/etc/garage.toml"
            sub_path   = "garage.toml"
          }
          volume_mount {
            name       = "meta"
            mount_path = "/var/lib/garage/meta"
          }
          volume_mount {
            name       = "data"
            mount_path = "/var/lib/garage/data"
          }
        }

        volume {
          name = "config"
          config_map { name = kubernetes_config_map_v1.garage_config.metadata[0].name }
        }
      }
    }

    volume_claim_template {
      metadata { name = "meta" }
      spec {
        access_modes       = ["ReadWriteOnce"]
        storage_class_name = var.storage_class
        resources { requests = { storage = var.meta_volume_size } }
      }
    }

    volume_claim_template {
      metadata { name = "data" }
      spec {
        access_modes       = ["ReadWriteOnce"]
        storage_class_name = var.storage_class
        resources { requests = { storage = var.data_volume_size } }
      }
    }
  }
}

resource "kubernetes_service_v1" "garage" {
  metadata {
    name      = "garage"
    namespace = var.namespace
  }
  spec {
    selector   = { app = "garage" }
    cluster_ip = "None"

    port {
      name = "s3-api"
      port = 3900
    }
    port {
      name = "rpc"
      port = 3901
    }
    port {
      name = "s3-web"
      port = 3902
    }
    port {
      name = "admin-api"
      port = 3903
    }
    port {
      name = "k2v-api"
      port = 3904
    }
  }
}