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

variable "secret_name" {
  type = string
}

variable "enable_liveness_probe" {
  type    = bool
  default = true
}

variable "liveness_path" {
  type    = string
  default = "/api/healthz/liveness"
}

variable "liveness_initial_delay_seconds" {
  type    = number
  default = 15
}

variable "liveness_period_seconds" {
  type    = number
  default = 20
}

variable "liveness_timeout_seconds" {
  type    = number
  default = 5
}

variable "liveness_success_threshold" {
  type    = number
  default = 1
}

variable "liveness_failure_threshold" {
  type    = number
  default = 3
}

variable "enable_readiness_probe" {
  type    = bool
  default = true
}

variable "readiness_path" {
  type    = string
  default = "/api/healthz/readiness"
}

variable "readiness_initial_delay_seconds" {
  type    = number
  default = 20
}

variable "readiness_period_seconds" {
  type    = number
  default = 15
}

variable "readiness_timeout_seconds" {
  type    = number
  default = 5
}

variable "readiness_success_threshold" {
  type    = number
  default = 1
}

variable "readiness_failure_threshold" {
  type    = number
  default = 3
}

variable "enable_startup_probe" {
  type    = bool
  default = true
}

variable "startup_path" {
  type    = string
  default = "/api/healthz/startup"
}

variable "startup_initial_delay_seconds" {
  type    = number
  default = 0
}

variable "startup_period_seconds" {
  type    = number
  default = 10
}

variable "startup_timeout_seconds" {
  type    = number
  default = 5
}

variable "startup_success_threshold" {
  type    = number
  default = 1
}

variable "startup_failure_threshold" {
  type    = number
  default = 15
}
