import { Injectable } from "@nestjs/common";
import { HealthIndicatorResult, HealthIndicatorService } from "@nestjs/terminus";

import { type IEventLoopLagHealthIndicator } from "@/modules/healthcheck/services/interfaces/IEventLoopLagHealthIndicator";

@Injectable()
export class EventLoopLagHealthIndicator implements IEventLoopLagHealthIndicator {
    private readonly THRESHOLD_MS = 500;
    private readonly KEY = "event_loop_lag";

    constructor(private readonly healthIndicatorService: HealthIndicatorService) {}

    async check(): Promise<HealthIndicatorResult> {
        const indicator = this.healthIndicatorService.check(this.KEY);
        const start = process.hrtime();

        return new Promise((resolve) => {
            setImmediate(() => {
                const [seconds, nanoseconds] = process.hrtime(start);
                const delayMs = seconds * 1000 + nanoseconds / 1e6;

                const isHealthy = delayMs < this.THRESHOLD_MS;
                const info = { delayMs: delayMs.toFixed(2) };

                if (isHealthy) {
                    return resolve(indicator.up(info));
                }

                return resolve(indicator.down(info));
            });
        });
    }
}
