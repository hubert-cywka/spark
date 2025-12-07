#!/bin/sh

set -e
/usr/local/bin/envsubst < /envoy.config.yaml.template > /tmp/envoy.config.yaml
exec /usr/local/bin/envoy -c /tmp/envoy.config.yaml \
    --use-dynamic-base-id \
    --log-format "{\"level\": \"%l\", \"timestamp\": \"%Y-%m-%dT%T.%eZ\", \"category\": \"%n\", \"source\":\"%g:%#\", \"msg\": \"%j\"}"