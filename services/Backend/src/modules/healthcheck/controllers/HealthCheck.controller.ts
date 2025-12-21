import { Controller, Get, Inject } from "@nestjs/common";
import { HealthCheckService } from "@nestjs/terminus";

import {
    type IHealthCheckProbesRegistry,
    HealthCheckProbesRegistryToken,
} from "@/modules/healthcheck/services/interfaces/IHealthCheckProbesRegistry";

@Controller("healthz")
export class HealthCheckController {
    constructor(
        private health: HealthCheckService,
        @Inject(HealthCheckProbesRegistryToken)
        private readonly healthCheckProbesService: IHealthCheckProbesRegistry
    ) {}

    @Get("/liveness")
    public async liveness() {
        return this.health.check(this.healthCheckProbesService.getLivenessHealthChecks());
    }

    @Get("/readiness")
    public async readiness() {
        return this.health.check(this.healthCheckProbesService.getReadinessHealthChecks());
    }

    @Get("/startup")
    public async startup() {
        return this.health.check(this.healthCheckProbesService.getStartupHealthChecks());
    }
}
