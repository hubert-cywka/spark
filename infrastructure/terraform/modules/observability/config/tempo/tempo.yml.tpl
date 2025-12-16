server:
  http_listen_port: ${tempo_http_port}

distributor:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: "0.0.0.0:${tempo_grpc_port}"
        http:
          endpoint: "0.0.0.0:${tempo_http_port_otlp}"

storage:
  trace:
    backend: local
    wal:
      path: /var/tempo/wal
    local:
      path: /var/tempo/blocks

overrides:
  metrics_generator_processors: [service-graphs, span-metrics]