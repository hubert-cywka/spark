FROM envoyproxy/envoy:v1.26.0

RUN apt-get update && \
    apt-get install -y gettext

COPY config.yaml /envoy.config.yaml.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
