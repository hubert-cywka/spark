FROM envoyproxy/envoy:v1.26-latest

RUN apt-get update && apt-get install gettext -y

COPY envoy.yaml envoy.yaml.template
COPY entrypoint.sh .
RUN chmod 500 entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
