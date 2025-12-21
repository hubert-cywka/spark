import { trace } from "@opentelemetry/api";

import { OTEL_APP_NAME } from "@/common/observability/constants";

export const otelTracer = trace.getTracer(OTEL_APP_NAME);
