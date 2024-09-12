#!/bin/sh
cat /envoy.yaml.template | envsubst > /etc/config.yaml
echo "Waiting for Proxy service to start..."
/usr/local/bin/envoy -c /etc/config.yaml --use-dynamic-base-id --log-format "{\"level\": \"%l\", \"timestamp\": \"%Y-%m-%dT%T.%eZ\", \"category\": \"%n\", \"source\":\"%g:%#\", \"msg\": \"%j\"}"
