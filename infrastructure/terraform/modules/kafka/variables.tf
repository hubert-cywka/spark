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
