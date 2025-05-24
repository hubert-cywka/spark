import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import {
    type IInboxEventHandler,
    InboxEventHandlersToken,
    IntegrationEventsModule,
    IntegrationEventStreams,
    IntegrationEventTopics,
} from "@/common/events";
import {
    type IIntegrationEventsJobsOrchestrator,
    IntegrationEventsJobsOrchestratorToken,
} from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import {
    type IIntegrationEventsSubscriber,
    IntegrationEventsSubscriberToken,
} from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { RecipientEntity } from "@/modules/mail/entities/Recipient.entity";
import { AccountActivatedEventHandler } from "@/modules/mail/events/AccountActivatedEvent.handler";
import { AccountActivationTokenRequestedEventHandler } from "@/modules/mail/events/AccountActivationTokenRequestedEvent.handler";
import { AccountPasswordUpdatedEventHandler } from "@/modules/mail/events/AccountPasswordUpdatedEvent.handler";
import { AccountRemovalScheduledEventHandler } from "@/modules/mail/events/AccountRemovalScheduledEvent.handler";
import { AccountRemovedEventHandler } from "@/modules/mail/events/AccountRemovedEvent.handler";
import { AccountRequestedPasswordResetEventHandler } from "@/modules/mail/events/AccountRequestedPasswordResetEvent.handler";
import { DailyReminderTriggeredEventHandler } from "@/modules/mail/events/DailyReminderTriggeredEvent.handler";
import { TwoFactorAuthCodeIssuedEventHandler } from "@/modules/mail/events/TwoFactorAuthCodeIssuedEvent.handler";
import { MAIL_MODULE_DATA_SOURCE } from "@/modules/mail/infrastructure/database/constants";
import { InitializeMailModule1735737562761 } from "@/modules/mail/infrastructure/database/migrations/1735737562761-InitializeMailModule";
import { AddTenantIdToOutboxAndInbox1743101783697 } from "@/modules/mail/infrastructure/database/migrations/1743101783697-addTenantIdToOutboxAndInbox";
import { EncryptedEvents1746294905909 } from "@/modules/mail/infrastructure/database/migrations/1746294905909-encryptedEvents";
import { AddRecipient1748032112854 } from "@/modules/mail/infrastructure/database/migrations/1748032112854-AddRecipient";
import { RecipientMapperToken } from "@/modules/mail/mappers/IRecipient.mapper";
import { RecipientMapper } from "@/modules/mail/mappers/Recipient.mapper";
import { EmailLookupService } from "@/modules/mail/services/implementations/EmailLookup.service";
import { RecipientService } from "@/modules/mail/services/implementations/Recipient.service";
import { SendGridMailerService } from "@/modules/mail/services/implementations/SendGridMailer.service";
import { EmailLookupServiceToken } from "@/modules/mail/services/interfaces/IEmailLookup.service";
import { MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { RecipientServiceToken } from "@/modules/mail/services/interfaces/IRecipient.service";
import { EmailTemplateFactoryToken } from "@/modules/mail/templates/IEmailTemplate.factory";
import { SendgridEmailTemplateFactory } from "@/modules/mail/templates/sendgrid/SendgridEmailTemplate.factory";

@Module({
    providers: [
        {
            provide: RecipientMapperToken,
            useClass: RecipientMapper,
        },
        {
            provide: RecipientServiceToken,
            useClass: RecipientService,
        },
        {
            provide: EmailLookupServiceToken,
            useClass: EmailLookupService,
        },
        {
            provide: MailerServiceToken,
            useClass: SendGridMailerService,
        },
        {
            provide: EmailTemplateFactoryToken,
            useClass: SendgridEmailTemplateFactory,
        },
        {
            provide: AccountActivatedEventHandler,
            useClass: AccountActivatedEventHandler,
        },
        {
            provide: AccountActivationTokenRequestedEventHandler,
            useClass: AccountActivationTokenRequestedEventHandler,
        },
        {
            provide: AccountPasswordUpdatedEventHandler,
            useClass: AccountPasswordUpdatedEventHandler,
        },
        {
            provide: AccountRequestedPasswordResetEventHandler,
            useClass: AccountRequestedPasswordResetEventHandler,
        },
        {
            provide: DailyReminderTriggeredEventHandler,
            useClass: DailyReminderTriggeredEventHandler,
        },
        {
            provide: AccountRemovedEventHandler,
            useClass: AccountRemovedEventHandler,
        },
        {
            provide: AccountRemovalScheduledEventHandler,
            useClass: AccountRemovalScheduledEventHandler,
        },
        {
            provide: TwoFactorAuthCodeIssuedEventHandler,
            useClass: TwoFactorAuthCodeIssuedEventHandler,
        },
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
                AccountRemovalScheduledEventHandler,
                TwoFactorAuthCodeIssuedEventHandler,
            ],
        },
    ],
    imports: [
        DatabaseModule.forRootAsync(MAIL_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.mail.database.logging"),
                port: configService.getOrThrow<number>("modules.mail.database.port"),
                username: configService.getOrThrow<string>("modules.mail.database.username"),
                password: configService.getOrThrow<string>("modules.mail.database.password"),
                host: configService.getOrThrow<string>("modules.mail.database.host"),
                database: configService.getOrThrow<string>("modules.mail.database.name"),
                migrations: [
                    InitializeMailModule1735737562761,
                    AddTenantIdToOutboxAndInbox1743101783697,
                    EncryptedEvents1746294905909,
                    AddRecipient1748032112854,
                ],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(MAIL_MODULE_DATA_SOURCE, [RecipientEntity]),
        IntegrationEventsModule.forFeature({
            context: MailModule.name,
            connectionName: MAIL_MODULE_DATA_SOURCE,
        }),
    ],
    controllers: [],
})
export class MailModule implements OnModuleInit {
    public constructor(
        @Inject(IntegrationEventsSubscriberToken)
        private readonly subscriber: IIntegrationEventsSubscriber,
        @Inject(IntegrationEventsJobsOrchestratorToken)
        private readonly orchestrator: IIntegrationEventsJobsOrchestrator,
        @Inject(InboxEventHandlersToken)
        private readonly handlers: IInboxEventHandler[]
    ) {}

    public onModuleInit() {
        this.orchestrator.start(this.handlers);
        void this.subscriber.listen([
            {
                name: "codename_mail_account",
                stream: IntegrationEventStreams.account,
                subjects: [
                    IntegrationEventTopics.account.activation.requested,
                    IntegrationEventTopics.account.password.resetRequested,
                    IntegrationEventTopics.account.password.updated,
                    IntegrationEventTopics.account.activation.completed,
                    IntegrationEventTopics.account.removal.completed,
                    IntegrationEventTopics.account.removal.scheduled,
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
        ]);
    }
}
