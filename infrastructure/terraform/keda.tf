resource "kubernetes_namespace_v1" "keda" {
  metadata {
    name = "keda"
  }
}

resource "helm_release" "keda" {
  name       = "keda"
  repository = "https://kedacore.github.io/charts"
  chart      = "keda"

  namespace = kubernetes_namespace_v1.keda.metadata[0].name

  timeout = 1200
  wait    = true
}
