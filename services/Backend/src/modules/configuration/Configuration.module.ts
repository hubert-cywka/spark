import { DynamicModule, Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { CONFIGURATION_MODULE_DATA_SOURCE } from "./infrastructure/database/constants";

import { DatabaseModule } from "@/common/database/Database.module";
import { type IInboxEventHandler, InboxEventHandlersToken, IntegrationEvents, IntegrationEventsModule } from "@/common/events";
import { getIntegrationEventsMigrations } from "@/common/events/migrations";
import {
    type IIntegrationEventsJobsOrchestrator,
    IntegrationEventsJobsOrchestratorToken,
} from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import {
    type IIntegrationEventsSubscriber,
    IntegrationEventsSubscriberToken,
} from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { FeatureFlagsController } from "@/modules/configuration/controllers/FeatureFlags.controller";
import { FeatureFlagEntity } from "@/modules/configuration/entities/FeatureFlag.entity";
import { TenantEntity } from "@/modules/configuration/entities/Tenant.entity";
import { TenantCreatedEventHandler } from "@/modules/configuration/events/TenantCreatedEvent.handler";
import { TenantRemovedEventHandler } from "@/modules/configuration/events/TenantRemovedEvent.handler";
import { InitConfigurationModule1765016363086 } from "@/modules/configuration/infrastructure/database/migrations/1765016363086-init-configuration-module";
import { AddFeatureFlagsTable1765020949930 } from "@/modules/configuration/infrastructure/database/migrations/1765020949930-add-feature-flags-table";
import { AddIndicesToFfTable1765022076178 } from "@/modules/configuration/infrastructure/database/migrations/1765022076178-add-indices-to-ff-table";
import { FeatureFlagMapper } from "@/modules/configuration/mappers/FeatureFlag.mapper";
import { FeatureFlagMapperToken } from "@/modules/configuration/mappers/IFeatureFlag.mapper";
import { TenantMapperToken } from "@/modules/configuration/mappers/ITenant.mapper";
import { TenantMapper } from "@/modules/configuration/mappers/Tenant.mapper";
import { FeatureFlagService } from "@/modules/configuration/services/implementations/FeatureFlagService";
import { FeatureFlagsProvider } from "@/modules/configuration/services/implementations/FeatureFlagsProvider";
import { FeatureFlagsStore } from "@/modules/configuration/services/implementations/FeatureFlagsStore";
import { TenantService } from "@/modules/configuration/services/implementations/TenantService";
import { FeatureFlagServiceToken } from "@/modules/configuration/services/interfaces/IFeatureFlagService";
import { FeatureFlagsProviderToken } from "@/modules/configuration/services/interfaces/IFeatureFlagsProvider";
import { FeatureFlagsStoreToken } from "@/modules/configuration/services/interfaces/IFeatureFlagsStore";
import { TenantServiceToken } from "@/modules/configuration/services/interfaces/ITenantService";
import { HealthCheckModule } from "@/modules/healthcheck/HealthCheck.module";
import {
    type IHealthCheckProbesRegistry,
    HealthCheckProbesRegistryToken,
} from "@/modules/healthcheck/services/interfaces/IHealthCheckProbesRegistry";

@Module({
    providers: [
        { provide: FeatureFlagMapperToken, useClass: FeatureFlagMapper },
        { provide: FeatureFlagServiceToken, useClass: FeatureFlagService },
        { provide: FeatureFlagsStoreToken, useClass: FeatureFlagsStore },
        { provide: FeatureFlagsProviderToken, useClass: FeatureFlagsProvider },
        { provide: TenantMapperToken, useClass: TenantMapper },
        { provide: TenantServiceToken, useClass: TenantService },
        {
            provide: TenantCreatedEventHandler,
            useClass: TenantCreatedEventHandler,
        },
        {
            provide: TenantRemovedEventHandler,
            useClass: TenantRemovedEventHandler,
        },
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [TenantCreatedEventHandler, TenantRemovedEventHandler],
        },
    ],
    imports: [
        HealthCheckModule,
        DatabaseModule.forRootAsync(CONFIGURATION_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.configuration.database.logging"),
                port: configService.getOrThrow<number>("modules.configuration.database.port"),
                username: configService.getOrThrow<string>("modules.configuration.database.username"),
                password: configService.getOrThrow<string>("modules.configuration.database.password"),
                host: configService.getOrThrow<string>("modules.configuration.database.host"),
                database: configService.getOrThrow<string>("modules.configuration.database.name"),
                migrations: [
                    ...getIntegrationEventsMigrations(),
                    InitConfigurationModule1765016363086,
                    AddFeatureFlagsTable1765020949930,
                    AddIndicesToFfTable1765022076178,
                ],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(CONFIGURATION_MODULE_DATA_SOURCE, [TenantEntity, FeatureFlagEntity]),
        IntegrationEventsModule.forFeatureAsync({
            context: ConfigurationModule.name,
            consumerGroupId: "configuration",
            connectionName: CONFIGURATION_MODULE_DATA_SOURCE,
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
    controllers: [FeatureFlagsController],
})
export class ConfigurationModule implements OnModuleInit {
    public constructor(
        @Inject(IntegrationEventsSubscriberToken)
        private readonly subscriber: IIntegrationEventsSubscriber,
        @Inject(IntegrationEventsJobsOrchestratorToken)
        private readonly orchestrator: IIntegrationEventsJobsOrchestrator,
        @Inject(InboxEventHandlersToken)
        private readonly handlers: IInboxEventHandler[],
        @InjectDataSource(CONFIGURATION_MODULE_DATA_SOURCE)
        private readonly dataSource: DataSource,
        @Inject(HealthCheckProbesRegistryToken)
        private readonly healthCheckProbesService: IHealthCheckProbesRegistry
    ) {}

    static forRoot(options?: { global?: boolean }): DynamicModule {
        return {
            module: PublicConfigurationModule,
            global: options?.global,
            imports: [],
            providers: [
                { provide: FeatureFlagsStoreToken, useClass: FeatureFlagsStore },
                { provide: FeatureFlagsProviderToken, useClass: FeatureFlagsProvider },
            ],
            exports: [FeatureFlagsProviderToken],
        };
    }

    public onModuleInit() {
        this.healthCheckProbesService.registerDatabaseConnectionProbe(`database_${CONFIGURATION_MODULE_DATA_SOURCE}`, this.dataSource);

        this.orchestrator.startProcessingInbox(this.handlers);
        this.orchestrator.startClearingInbox();
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingOutbox();

        void this.subscriber.listen([IntegrationEvents.account.created, IntegrationEvents.account.removal.completed]);
    }
}

export class PublicConfigurationModule {}
