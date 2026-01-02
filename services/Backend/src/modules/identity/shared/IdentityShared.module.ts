import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { DatabaseModule } from "@/common/database/Database.module";
import { IntegrationEventsModule } from "@/common/events";
import { getIntegrationEventsMigrations } from "@/common/events/migrations";
import { HealthCheckModule } from "@/modules/healthcheck/HealthCheck.module";
import {
    type IHealthCheckProbesRegistry,
    HealthCheckProbesRegistryToken,
} from "@/modules/healthcheck/services/interfaces/IHealthCheckProbesRegistry";
import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { RegenerateMigrations1749289911264 } from "@/modules/identity/infrastructure/database/migrations/1749289911264-regenerate-migrations";
import { AddIndexes1767381819714 } from "@/modules/identity/infrastructure/database/migrations/1767381819714-add-indexes";

@Module({
    imports: [
        HealthCheckModule,
        DatabaseModule.forRootAsync(IDENTITY_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.identity.database.logging"),
                port: configService.getOrThrow<number>("modules.identity.database.port"),
                username: configService.getOrThrow<string>("modules.identity.database.username"),
                password: configService.getOrThrow<string>("modules.identity.database.password"),
                host: configService.getOrThrow<string>("modules.identity.database.host"),
                database: configService.getOrThrow<string>("modules.identity.database.name"),
                migrations: [...getIntegrationEventsMigrations(), RegenerateMigrations1749289911264, AddIndexes1767381819714],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(IDENTITY_MODULE_DATA_SOURCE, [
            RefreshTokenEntity,
            SingleUseTokenEntity,
            BaseAccountEntity,
            ManagedAccountEntity,
            FederatedAccountEntity,
            TwoFactorAuthenticationIntegrationEntity,
        ]),
        IntegrationEventsModule.forFeatureAsync({
            context: IdentitySharedModule.name,
            consumerGroupId: "identity",
            connectionName: IDENTITY_MODULE_DATA_SOURCE,
            useFactory: (configService: ConfigService) => ({
                inboxProcessorOptions: {
                    maxAttempts: configService.getOrThrow<number>("events.inbox.processing.maxAttempts"),
                    maxBatchSize: configService.getOrThrow<number>("events.inbox.processing.maxBatchSize"),
                },
                outboxProcessorOptions: {
                    maxAttempts: configService.getOrThrow<number>("events.outbox.processing.maxAttempts"),
                    maxBatchSize: configService.getOrThrow<number>("events.outbox.processing.maxBatchSize"),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [IntegrationEventsModule, DatabaseModule],
})
export class IdentitySharedModule implements OnModuleInit {
    constructor(
        @InjectDataSource(IDENTITY_MODULE_DATA_SOURCE)
        private readonly dataSource: DataSource,
        @Inject(HealthCheckProbesRegistryToken)
        private readonly healthCheckProbesService: IHealthCheckProbesRegistry
    ) {}

    onModuleInit() {
        this.healthCheckProbesService.registerDatabaseConnectionProbe(`database_${IDENTITY_MODULE_DATA_SOURCE}`, this.dataSource);
    }
}
