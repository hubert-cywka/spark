import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import {
    IInboxEventHandler,
    InboxEventHandlersToken,
    IntegrationEventsModule,
    IntegrationEventStreams,
    IntegrationEventTopics,
} from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { AccountActivatedEventHandler } from "@/modules/mail/events/AccountActivatedEvent.handler";
import { AccountActivationTokenRequestedEventHandler } from "@/modules/mail/events/AccountActivationTokenRequestedEvent.handler";
import { AccountPasswordUpdatedEventHandler } from "@/modules/mail/events/AccountPasswordUpdatedEvent.handler";
import { AccountRemovalRequestedEventHandler } from "@/modules/mail/events/AccountRemovalRequestedEvent.handler";
import { AccountRemovedEventHandler } from "@/modules/mail/events/AccountRemovedEvent.handler";
import { AccountRequestedPasswordResetEventHandler } from "@/modules/mail/events/AccountRequestedPasswordResetEvent.handler";
import { DailyReminderTriggeredEventHandler } from "@/modules/mail/events/DailyReminderTriggeredEvent.handler";
import { TwoFactorAuthCodeIssuedEventHandler } from "@/modules/mail/events/TwoFactorAuthCodeIssuedEvent.handler";
import { MAIL_MODULE_DATA_SOURCE } from "@/modules/mail/infrastructure/database/constants";
import { InitializeMailModule1735737562761 } from "@/modules/mail/infrastructure/database/migrations/1735737562761-InitializeMailModule";
import { AddTenantIdToOutboxAndInbox1743101783697 } from "@/modules/mail/infrastructure/database/migrations/1743101783697-addTenantIdToOutboxAndInbox";
import { MailSubscriber } from "@/modules/mail/Mail.subscriber";
import { MailerService } from "@/modules/mail/services/implementations/Mailer.service";
import { MailEventBoxFactory } from "@/modules/mail/services/implementations/MailEventBox.factory";
import { MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";

@Module({
    providers: [
        {
            provide: MailerServiceToken,
            useClass: MailerService,
        },
        AccountActivatedEventHandler,
        AccountActivationTokenRequestedEventHandler,
        AccountPasswordUpdatedEventHandler,
        AccountRequestedPasswordResetEventHandler,
        DailyReminderTriggeredEventHandler,
        AccountRemovedEventHandler,
        AccountRemovalRequestedEventHandler,
        TwoFactorAuthCodeIssuedEventHandler,
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [
                AccountActivatedEventHandler,
                AccountActivationTokenRequestedEventHandler,
                AccountPasswordUpdatedEventHandler,
                AccountRequestedPasswordResetEventHandler,
                DailyReminderTriggeredEventHandler,
                AccountRemovedEventHandler,
                AccountRemovalRequestedEventHandler,
                TwoFactorAuthCodeIssuedEventHandler,
            ],
        },
    ],
    imports: [
        DatabaseModule.forRootAsync(MAIL_MODULE_DATA_SOURCE, [OutboxEventEntity, InboxEventEntity], {
            useFactory: (configService: ConfigService) => ({
                port: configService.getOrThrow<number>("modules.mail.database.port"),
                username: configService.getOrThrow<string>("modules.mail.database.username"),
                password: configService.getOrThrow<string>("modules.mail.database.password"),
                host: configService.getOrThrow<string>("modules.mail.database.host"),
                database: configService.getOrThrow<string>("modules.mail.database.name"),
                migrations: [InitializeMailModule1735737562761, AddTenantIdToOutboxAndInbox1743101783697],
            }),
            inject: [ConfigService],
        }),
        IntegrationEventsModule.forFeature({
            eventBoxFactoryClass: MailEventBoxFactory,
            context: MailModule.name,
            consumers: [
                {
                    name: "codename_mail_account",
                    stream: IntegrationEventStreams.account,
                    subjects: [
                        IntegrationEventTopics.account.activation.requested,
                        IntegrationEventTopics.account.password.resetRequested,
                        IntegrationEventTopics.account.password.updated,
                        IntegrationEventTopics.account.activation.completed,
                        IntegrationEventTopics.account.removal.completed,
                        IntegrationEventTopics.account.removal.requested,
                    ],
                },
                {
                    name: "codename_mail_alert",
                    stream: IntegrationEventStreams.alert,
                    subjects: [IntegrationEventTopics.alert.daily.reminder.triggered],
                },
                {
                    name: "codename_mail_2fa",
                    stream: IntegrationEventStreams.twoFactorAuth,
                    subjects: [IntegrationEventTopics.twoFactorAuth.email.issued],
                },
            ],
        }),
    ],
    controllers: [MailSubscriber],
})
export class MailModule {}
