import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { HealthCheckController } from "@/modules/healthcheck/controllers/HealthCheck.controller";
import { EventLoopLagHealthIndicator } from "@/modules/healthcheck/services/implementations/EventLoopHealthIndicator";
import { HealthCheckProbesRegistry } from "@/modules/healthcheck/services/implementations/HealthCheckProbesRegistry";
import { EventLoopLagHealthIndicatorToken } from "@/modules/healthcheck/services/interfaces/IEventLoopLagHealthIndicator";
import { HealthCheckProbesRegistryToken } from "@/modules/healthcheck/services/interfaces/IHealthCheckProbesRegistry";

@Module({
    providers: [
        {
            provide: HealthCheckProbesRegistryToken,
            useClass: HealthCheckProbesRegistry,
        },
        {
            provide: EventLoopLagHealthIndicatorToken,
            useClass: EventLoopLagHealthIndicator,
        },
    ],
    imports: [TerminusModule],
    controllers: [HealthCheckController],
    exports: [HealthCheckProbesRegistryToken],
})
export class HealthCheckModule {}
