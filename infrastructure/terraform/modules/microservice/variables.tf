variable "service_name" {
  type = string
}

variable "namespace" {
  type = string
}

variable "image" {
  type = string
}

variable "replicas" {
  type    = number
  default = 1
}

variable "service_port" {
  type = number
}

variable "container_port" {
  type = number
}

variable "env_vars" {
  type    = map(string)
  default = {}
}
