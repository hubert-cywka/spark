#!/bin/sh
cat /envoy.yaml.template | envsubst > /etc/envoy.yaml
echo "Waiting for Envoy to start..."
/usr/local/bin/envoy -c /etc/envoy.yaml --use-dynamic-base-id --log-format "{\"level\": \"%l\", \"timestamp\": \"%Y-%m-%dT%T.%eZ\", \"category\": \"%n\", \"source\":\"%g:%#\", \"msg\": \"%j\"}"
