import { Controller, Get } from "@nestjs/common";

// TODO: Implement health checks logic
@Controller("healthz")
export class HealthCheckController {
    @Get("/liveness")
    public async liveness() {
        return "OK";
    }

    @Get("/readiness")
    public async readiness() {
        return "OK";
    }
}
