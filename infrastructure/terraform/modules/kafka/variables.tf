variable "namespace" {
  type = string
}

variable "cluster_id" {
  type = string
}

variable "num_partitions" {
  type = number
}

variable "broker_internal_port" {
  type = number
}

variable "controller_internal_port" {
  type = number
}

variable "log_segment_bytes" {
  type = number
}

variable "broker_replicas" {
  type = number
}

variable "controller_replicas" {
  type = number
}

variable "controller_volume_size_request" {
  type = string
}

variable "broker_volume_size_request" {
  type = string
}
