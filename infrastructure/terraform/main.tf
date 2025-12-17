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


