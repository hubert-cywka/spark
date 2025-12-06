variable "namespace" {
  type = string
}

variable "redis_image_tag" {
  type    = string
  default = "8.4.0"
}

variable "redis_port" {
  type    = number
  default = 6379
}

variable "volume_size_request" {
  type = string
}