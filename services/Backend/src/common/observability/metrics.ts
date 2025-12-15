import { metrics } from "@opentelemetry/api";

import { OTEL_APP_NAME } from "@/common/observability/constants";

export const otelMeter = metrics.getMeter(OTEL_APP_NAME);
