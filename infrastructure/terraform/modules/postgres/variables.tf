variable "namespace" {
  type = string
}

variable "postgresql_image_tag" {
  type    = string
  default = "17.0"
}

variable "postgresql_port" {
  type    = number
  default = 5432
}

variable "database_username" {
  type = string
}

variable "database_password" {
  type      = string
  sensitive = true
}

variable "pgbouncer_image_tag" {
  type    = string
  default = "1.24.1"
}

variable "database_port" {
  type    = number
  default = 6432
}

variable "pgbouncer_pool_mode" {
  type    = string
  default = "session"
}

variable "pgbouncer_query_wait_timeout" {
  type    = number
  default = 120
}

variable "pgbouncer_max_client_conn" {
  type    = number
  default = 200
}

variable "pgbouncer_default_pool_size" {
  type    = number
  default = 20
}

variable "pgbouncer_stats_users" {
  type    = string
  default = "pgbouncer"
}

variable "database_name" {
  type    = string
  default = "postgres"
}
