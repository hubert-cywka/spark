import { createHook } from "node:async_hooks";

import { otelTracer } from "@/common/observability/traces";

const THRESHOLD_NS = 5e7; // 50ms

const cache = new Map<number, { type: string; start?: [number, number] }>();

function init(asyncId: number, type: string) {
    cache.set(asyncId, { type });
}

function destroy(asyncId: number) {
    cache.delete(asyncId);
}

function before(asyncId: number) {
    const cached = cache.get(asyncId);

    if (!cached) {
        return;
    }

    cache.set(asyncId, {
        ...cached,
        start: process.hrtime(),
    });
}

function after(asyncId: number) {
    const cached = cache.get(asyncId);

    if (!cached) {
        return;
    }

    cache.delete(asyncId);

    if (!cached.start) {
        return;
    }

    const diff = process.hrtime(cached.start);
    const diffNs = diff[0] * 1e9 + diff[1];

    if (diffNs > THRESHOLD_NS) {
        const timeMs = diffNs / 1e6;

        const newSpan = otelTracer.startSpan("event-loop-blocked", {
            startTime: new Date(new Date().getTime() - timeMs),
            attributes: {
                asyncType: cached.type,
                label: "EventLoopMonitor",
            },
        });

        newSpan.end();
    }
}

// This hook will detect operations that block the event loop, and produce a trace, so it's easier to track.
const eventLoopMonitorHook = createHook({ init, before, after, destroy });

export const enableEventLoopMonitor = () => eventLoopMonitorHook.enable();
export const disableEventLoopMonitor = () => eventLoopMonitorHook.disable();
