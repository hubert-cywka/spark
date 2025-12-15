import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

import { OTEL_APP_NAME } from "@/common/observability/constants";

const metricExporter = new OTLPMetricExporter();
const traceExporter = new OTLPTraceExporter();

const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 10000,
});

export const openTelemetrySDK = new NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: OTEL_APP_NAME,
    }),
    traceExporter,
    metricReaders: [metricReader],
    instrumentations: [getNodeAutoInstrumentations()],
});

openTelemetrySDK.start();

process.on("SIGTERM", async () => {
    await openTelemetrySDK.shutdown();
});
