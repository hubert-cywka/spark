FROM debian:bookworm-slim AS build

RUN apt-get update && \
    apt-get install -y curl ca-certificates dash && \
    rm -rf /var/lib/apt/lists/*

RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.4.2/envsubst-Linux-x86_64 -o /usr/local/bin/envsubst && \
    chmod +x /usr/local/bin/envsubst

COPY config.yaml /config.yaml
COPY entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

FROM envoyproxy/envoy-distroless:v1.31.0

COPY --from=build /bin/dash /bin/sh
COPY --from=build /usr/local/bin/envsubst /usr/local/bin/envsubst
COPY --from=build /config.yaml /envoy.config.yaml.template
COPY --from=build /entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]