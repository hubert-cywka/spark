import blockedAt from "blocked-at";

import { otelTracer } from "@/common/observability/traces";

const THRESHOLD_MS = 50;

let monitor: blockedAt.Return;

const createEventLoopMonitor = () => {
    return blockedAt((time, stack) => {
        if (time > THRESHOLD_MS) {
            createSpan(time, stack);
        }
    });
};

const createSpan = (time: number, stack: string[]) => {
    const span = otelTracer.startSpan("event-loop-blocked", {
        attributes: { duration_ms: time, stack: stack },
    });

    span.end();
};

export const enableEventLoopMonitor = () => {
    monitor = createEventLoopMonitor();
};

export const disableEventLoopMonitor = () => monitor.stop();
