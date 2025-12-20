import { Inject, Injectable } from "@nestjs/common";
import { HealthIndicatorFunction, TypeOrmHealthIndicator } from "@nestjs/terminus";
import { DataSource } from "typeorm";

import {
    type IEventLoopLagHealthIndicator,
    EventLoopLagHealthIndicatorToken,
} from "@/modules/healthcheck/services/interfaces/IEventLoopLagHealthIndicator";
import { type IHealthCheckProbesRegistry } from "@/modules/healthcheck/services/interfaces/IHealthCheckProbesRegistry";

@Injectable()
export class HealthCheckProbesRegistry implements IHealthCheckProbesRegistry {
    private readonly dbDataSources = new Map<string, DataSource>();

    constructor(
        private readonly dbHealthIndicator: TypeOrmHealthIndicator,
        @Inject(EventLoopLagHealthIndicatorToken)
        private readonly eventLoopHealthIndicator: IEventLoopLagHealthIndicator
    ) {}

    public registerDatabaseConnectionProbe(key: string, connection: DataSource) {
        this.dbDataSources.set(key, connection);
    }

    // Be careful about probing downstream dependencies.
    // - We check the database, because it's required in practically all request paths.
    // - Cache is not required in most request paths, and we can just throw 500 or fallback to DB lookup, it depends.
    // - Broker is not required in most request paths + we usually save events in the database first, using outbox.
    public getReadinessHealthChecks() {
        const healthChecks: HealthIndicatorFunction[] = [];

        for (const [key, dataSource] of this.dbDataSources) {
            healthChecks.push(() => this.dbHealthIndicator.pingCheck(key, { connection: dataSource }));
        }

        return healthChecks;
    }

    // Do not check any downstream dependencies at all. Check only if the service itself is alive.
    // - If the service is able to respond, it's probably alive.
    // - We can check stuff like event loop delay.
    public getLivenessHealthChecks() {
        const healthChecks: HealthIndicatorFunction[] = [];

        healthChecks.push(() => this.eventLoopHealthIndicator.check());

        return healthChecks;
    }

    // Do not check anything. If the service is able to respond, it has started.
    public getStartupHealthChecks() {
        return [];
    }
}
