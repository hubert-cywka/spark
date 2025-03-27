import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { IInboxEventHandler, InboxEventHandlersToken, IntegrationEventsModule } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { TenantEntity } from "@/modules/gdpr/entities/Tenant.entity";
import { TenantRegisteredEventHandler } from "@/modules/gdpr/events/TenantRegisteredEvent.handler";
import { TenantRemovedEventHandler } from "@/modules/gdpr/events/TenantRemovedEvent.handler";
import { GdprSubscriber } from "@/modules/gdpr/Gdpr.subscriber";
import { GDPR_MODULE_DATA_SOURCE } from "@/modules/gdpr/infrastructure/database/constants";
import { AddTenantEntity1743100640810 } from "@/modules/gdpr/infrastructure/database/migrations/1743100640810-addTenantEntity";
import { AddTenantIdToOutboxAndInbox1743101706566 } from "@/modules/gdpr/infrastructure/database/migrations/1743101706566-addTenantIdToOutboxAndInbox";
import { TenantMapperToken } from "@/modules/gdpr/mappers/ITenant.mapper";
import { TenantMapper } from "@/modules/gdpr/mappers/Tenant.mapper";
import { GdprEventBoxFactory } from "@/modules/gdpr/services/implementations/GdprEventBox.factory";
import { TenantService } from "@/modules/gdpr/services/implementations/Tenant.service";
import { TenantServiceToken } from "@/modules/gdpr/services/interfaces/ITenant.service";

@Module({
    providers: [
        {
            provide: TenantMapperToken,
            useClass: TenantMapper,
        },
        {
            provide: TenantServiceToken,
            useClass: TenantService,
        },
        TenantRegisteredEventHandler,
        TenantRemovedEventHandler,
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [TenantRegisteredEventHandler, TenantRemovedEventHandler],
        },
    ],
    imports: [
        DatabaseModule.forRootAsync(GDPR_MODULE_DATA_SOURCE, [OutboxEventEntity, InboxEventEntity, TenantEntity], {
            useFactory: (configService: ConfigService) => ({
                port: configService.getOrThrow<number>("modules.gdpr.database.port"),
                username: configService.getOrThrow<string>("modules.gdpr.database.username"),
                password: configService.getOrThrow<string>("modules.gdpr.database.password"),
                host: configService.getOrThrow<string>("modules.gdpr.database.host"),
                database: configService.getOrThrow<string>("modules.gdpr.database.name"),
                migrations: [AddTenantEntity1743100640810, AddTenantIdToOutboxAndInbox1743101706566],
            }),
            inject: [ConfigService],
        }),
        IntegrationEventsModule.forFeature({
            eventBoxFactoryClass: GdprEventBoxFactory,
            context: GdprModule.name,
        }),
    ],
    controllers: [GdprSubscriber],
})
export class GdprModule {}
