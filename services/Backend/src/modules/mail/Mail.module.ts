import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getDataSourceToken } from "@nestjs/typeorm";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { ClsModule } from "nestjs-cls";

import { DatabaseModule } from "@/common/database/Database.module";
import { IntegrationEventsModule } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { MAIL_MODULE_DATA_SOURCE } from "@/modules/mail/infrastructure/database/constants";
import { MailerService } from "@/modules/mail/services/implementations/Mailer.service";
import { MailEventBoxFactory } from "@/modules/mail/services/implementations/MailEventBox.factory";
import { IMailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { UserSubscriber } from "@/modules/mail/User.subscriber";

@Module({
    imports: [
        DatabaseModule.forRootAsync(MAIL_MODULE_DATA_SOURCE, [OutboxEventEntity, InboxEventEntity], {
            useFactory: (configService: ConfigService) => ({
                port: configService.getOrThrow<number>("modules.mail.database.port"),
                username: configService.getOrThrow<string>("modules.mail.database.username"),
                password: configService.getOrThrow<string>("modules.mail.database.password"),
                host: configService.getOrThrow<string>("modules.mail.database.host"),
                database: configService.getOrThrow<string>("modules.mail.database.name"),
                migrations: [],
            }),
            inject: [ConfigService],
        }),
        IntegrationEventsModule.forFeature(MailEventBoxFactory, MailModule.name),
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
    ],
    providers: [
        {
            provide: IMailerServiceToken,
            useClass: MailerService,
        },
    ],
    controllers: [UserSubscriber],
    exports: [IMailerServiceToken],
})
export class MailModule {}
