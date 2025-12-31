variable "namespace" {
  type = string
}

variable "garage_version" {
  type    = string
  default = "v2.1.0"
}

variable "replication_factor" {
  type    = number
  default = 1
}

variable "replicas" {
  type    = number
  default = 1
}

variable "rpc_secret" {
  type      = string
  sensitive = true
}

variable "admin_token" {
  type      = string
  sensitive = true
}

variable "metrics_token" {
  type      = string
  sensitive = true
}

variable "s3_region" {
  type    = string
  default = "garage"
}

variable "s3_root_domain" {
  type    = string
  default = ".s3.garage.localhost"
}

variable "web_root_domain" {
  type    = string
  default = ".web.garage.localhost"
}

variable "storage_class" {
  type    = string
  default = "standard"
}

variable "meta_volume_size" {
  type    = string
  default = "1Gi"
}

variable "data_volume_size" {
  type    = string
  default = "10Gi"
}