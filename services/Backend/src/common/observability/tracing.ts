import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const traceExporter = new OTLPTraceExporter();

const prometheusExporter = new PrometheusExporter({
    port: parseInt(process.env.PROMETHEUS_EXPORTER_PORT ?? ""),
    endpoint: process.env.PROMETHEUS_EXPORTER_ENDPOINT,
});

const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME,
    }),
    traceExporter,
    metricReaders: [prometheusExporter],
    instrumentations: [getNodeAutoInstrumentations()],
});

export const initializeTracing = () => {
    sdk.start();

    process.on("SIGTERM", async () => {
        await sdk.shutdown();
    });
};
