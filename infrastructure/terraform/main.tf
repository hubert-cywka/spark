locals {
  use_monolith = var.USE_MONOLITH

  backend_name  = "backend"
  frontend_name = "frontend"

  journal_service_name       = local.use_monolith ? local.backend_name : "journal-service"
  mail_service_name          = local.use_monolith ? local.backend_name : "mail-service"
  identity_service_name      = local.use_monolith ? local.backend_name : "identity-service"
  privacy_service_name       = local.use_monolith ? local.backend_name : "privacy-service"
  exports_service_name       = local.use_monolith ? local.backend_name : "exports-service"
  scheduling_service_name    = local.use_monolith ? local.backend_name : "scheduling-service"
  configuration_service_name = local.use_monolith ? local.backend_name : "configuration-service"
  alerts_service_name        = local.use_monolith ? local.backend_name : "alerts-service"
  users_service_name         = local.use_monolith ? local.backend_name : "users-service"
}

variable "kube_config" {
  default = "~/.kube/config"
}

provider "kubernetes" {
  config_path = var.kube_config
}

provider "helm" {
  kubernetes = {
    config_path = var.kube_config
  }
}

resource "kubernetes_namespace_v1" "app" {
  metadata {
    name = "spark"
  }
}


