import { HealthIndicatorFunction } from "@nestjs/terminus";
import { DataSource } from "typeorm";

export const HealthCheckProbesRegistryToken = Symbol("HealthCheckProbesRegistry");

export interface IHealthCheckProbesRegistry {
    registerDatabaseConnectionProbe(key: string, connection: DataSource): void;
    getReadinessHealthChecks(): HealthIndicatorFunction[];
    getLivenessHealthChecks(): HealthIndicatorFunction[];
    getStartupHealthChecks(): HealthIndicatorFunction[];
}
