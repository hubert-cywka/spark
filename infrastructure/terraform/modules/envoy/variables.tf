variable "namespace" {
  type = string
}

variable "envoy_port" {
  type = number
}

variable "envoy_internal_port" {
  type = number
}

variable "backend_port" {
  type = number
}

variable "frontend_port" {
  type = number
}

variable "allowed_origins" {
  type = string
}

variable "frontend_service_name" {
  type = string
}

variable "identity_service_name" {
  type = string
}

variable "journal_service_name" {
  type = string
}

variable "users_service_name" {
  type = string
}

variable "alerts_service_name" {
  type = string
}

variable "mail_service_name" {
  type = string
}

variable "privacy_service_name" {
  type = string
}

variable "exports_service_name" {
  type = string
}

variable "scheduling_service_name" {
  type = string
}

variable "configuration_service_name" {
  type = string
}

variable "envoy_image" {
  type    = string
  default = "hejs22/codename-gateway:latest"
}
