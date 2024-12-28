import { Module } from "@nestjs/common";
import { getDataSourceToken, TypeOrmModule } from "@nestjs/typeorm";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { ClsModule } from "nestjs-cls";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { EventBoxFactory, EventBoxFactoryToken } from "@/common/events/services/EventBox.factory";
import { EventInboxToken } from "@/common/events/services/IEventInbox";
import { EventOutboxToken } from "@/common/events/services/IEventOutbox";
import { DatabaseModule } from "@/modules/identity/infrastructure/database/Database.module";
import { MAIL_MODULE_DATA_SOURCE } from "@/modules/mail/infrastructure/database/constants";
import { MailerService } from "@/modules/mail/services/implementations/Mailer.service";
import { MailEventBoxFactory } from "@/modules/mail/services/implementations/MailEventBox.factory";
import { IMailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { UserSubscriber } from "@/modules/mail/User.subscriber";

@Module({
    imports: [
        DatabaseModule,
        ClsModule.forRoot({
            middleware: {
                mount: true,
            },
            plugins: [
                new ClsPluginTransactional({
                    connectionName: MAIL_MODULE_DATA_SOURCE,
                    adapter: new TransactionalAdapterTypeOrm({
                        dataSourceToken: getDataSourceToken(MAIL_MODULE_DATA_SOURCE),
                    }),
                }),
            ],
        }),
        TypeOrmModule.forFeature([OutboxEventEntity, InboxEventEntity], MAIL_MODULE_DATA_SOURCE),
    ],
    providers: [
        {
            provide: IMailerServiceToken,
            useClass: MailerService,
        },
        {
            provide: EventBoxFactoryToken,
            useClass: MailEventBoxFactory,
        },
        {
            provide: EventOutboxToken,
            useFactory: (factory: EventBoxFactory) => factory.createOutbox("IdentityOutbox"),
            inject: [EventBoxFactoryToken],
        },
        {
            provide: EventInboxToken,
            useFactory: (factory: EventBoxFactory) => factory.createInbox("IdentityOutbox"),
            inject: [EventBoxFactoryToken],
        },
    ],
    controllers: [UserSubscriber],
    exports: [IMailerServiceToken],
})
export class MailModule {}
