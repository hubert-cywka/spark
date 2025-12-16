variable "namespace" {
  type    = string
  default = "observability"
}

variable "tempo_volume_size_request" {
  type    = string
  default = "3Gi"
}

variable "grafana_volume_size_request" {
  type    = string
  default = "1Gi"
}

variable "prometheus_volume_size_request" {
  type    = string
  default = "3Gi"
}

variable "otel_collector_image_tag" {
  type    = string
  default = "latest"
}

variable "otel_grpc_port" {
  type    = number
  default = 4317
}

variable "otel_http_port" {
  type    = number
  default = 4318
}

variable "otel_metrics_port" {
  type    = number
  default = 8889
}

variable "prometheus_image_tag" {
  type    = string
  default = "latest"
}

variable "prometheus_web_port" {
  type    = number
  default = 9090
}

variable "tempo_image_tag" {
  type    = string
  default = "latest"
}

variable "tempo_http_port" {
  type    = number
  default = 3200
}

variable "tempo_grpc_port" {
  type    = number
  default = 4317
}

variable "tempo_http_port_otlp" {
  type    = number
  default = 4318
}

variable "grafana_image_tag" {
  type    = string
  default = "latest"
}

variable "grafana_port" {
  type    = number
  default = 3000
}

variable "grafana_admin_user" {
  type    = string
  default = "admin"
}

variable "grafana_admin_password" {
  type    = string
  default = "admin"
}