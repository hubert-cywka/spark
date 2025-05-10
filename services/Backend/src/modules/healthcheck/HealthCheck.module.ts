import { Module } from "@nestjs/common";

import { HealthCheckController } from "@/modules/healthcheck/controllers/HealthCheck.controller";

@Module({
    providers: [],
    imports: [],
    controllers: [HealthCheckController],
})
export class HealthCheckModule {}
