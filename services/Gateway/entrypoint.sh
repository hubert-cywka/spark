#!/bin/sh
cat /envoy.config.yaml.template | envsubst > /etc/envoy.config.yaml
echo "Waiting for Gateway service to start..."
/usr/local/bin/envoy -c /etc/envoy.config.yaml --use-dynamic-base-id --log-format "{\"level\": \"%l\", \"timestamp\": \"%Y-%m-%dT%T.%eZ\", \"category\": \"%n\", \"source\":\"%g:%#\", \"msg\": \"%j\"}"
