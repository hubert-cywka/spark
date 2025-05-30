variable "namespace_name" {
  type = string
}

variable "gateway_port" {
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

variable "gateway_image" {
  type    = string
  default = "hejs22/codename-gateway:latest"
}
