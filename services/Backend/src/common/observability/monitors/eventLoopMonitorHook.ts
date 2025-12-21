import blockedAt from "blocked-at";

import { otelTracer } from "@/common/observability/traces";

const THRESHOLD_MS = 50;

let monitor: blockedAt.Return;

// 'blocked-at' uses async_hooks under the hood, and it may negatively impact performance. We shouldn't run it on
// production, but using it in a dev environment is fine.
const createEventLoopMonitor = () => {
    return blockedAt(
        (time, stack, { type }) => {
            const span = otelTracer.startSpan("event-loop-blocked", {
                attributes: { duration_ms: time, stack, type },
            });

            span.end();
        },
        {
            threshold: THRESHOLD_MS,
        }
    );
};

export const enableEventLoopMonitor = () => {
    monitor = createEventLoopMonitor();
};

export const disableEventLoopMonitor = () => monitor.stop();
