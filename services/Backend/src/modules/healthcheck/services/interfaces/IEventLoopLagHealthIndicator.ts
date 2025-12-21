import { HealthIndicatorResult } from "@nestjs/terminus";

export const EventLoopLagHealthIndicatorToken = Symbol("EventLoopHealthLagIndicatorToken");

export interface IEventLoopLagHealthIndicator {
    check(): Promise<HealthIndicatorResult>;
}
