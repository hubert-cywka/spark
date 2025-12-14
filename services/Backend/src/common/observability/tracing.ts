import {diag, DiagConsoleLogger, DiagLogLevel} from "@opentelemetry/api";
import {getNodeAutoInstrumentations} from "@opentelemetry/auto-instrumentations-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { PeriodicExportingMetricReader} from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const metricExporter = new OTLPMetricExporter();
const traceExporter = new OTLPTraceExporter();

const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 10000,
});

export const openTelemetrySDK = new NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME,
    }),
    traceExporter,
    metricReaders: [metricReader],
    instrumentations: [
       getNodeAutoInstrumentations(),
    ],
});

console.log("Initializing...");
openTelemetrySDK.start();
console.log("Initialized.")