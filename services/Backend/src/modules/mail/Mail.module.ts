import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { type IInboxEventHandler, InboxEventHandlersToken, IntegrationEventsModule, IntegrationEventTopics } from "@/common/events";
import { InboxAndOutbox1749299050551 } from "@/common/events/migrations/1749299050551-inbox-and-outbox";
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
import { RegenerateMigrations1749289938815 } from "@/modules/mail/infrastructure/database/migrations/1749289938815-regenerate-migrations";
import { AddTimestamps1752925904452 } from "@/modules/mail/infrastructure/database/migrations/1752925904452-AddTimestamps";
import { RecipientMapperToken } from "@/modules/mail/mappers/IRecipient.mapper";
import { RecipientMapper } from "@/modules/mail/mappers/Recipient.mapper";
import { EmailLookup } from "@/modules/mail/services/implementations/EmailLookup.service";
import { RecipientService } from "@/modules/mail/services/implementations/Recipient.service";
import { SendGridMailSender } from "@/modules/mail/services/implementations/SendGridMailSender.service";
import { EmailLookupToken } from "@/modules/mail/services/interfaces/IEmailLookup.service";
import { MailSenderToken } from "@/modules/mail/services/interfaces/IMailSender.service";
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
            provide: EmailLookupToken,
            useClass: EmailLookup,
        },
        {
            provide: MailSenderToken,
            useClass: SendGridMailSender,
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
                migrations: [RegenerateMigrations1749289938815, InboxAndOutbox1749299050551, AddTimestamps1752925904452],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(MAIL_MODULE_DATA_SOURCE, [RecipientEntity]),
        IntegrationEventsModule.forFeatureAsync({
            context: MailModule.name,
            consumerGroupId: "mail",
            connectionName: MAIL_MODULE_DATA_SOURCE,
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
        this.orchestrator.startProcessingInbox(this.handlers);
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingInbox();
        this.orchestrator.startClearingOutbox();

        void this.subscriber.listen([
            IntegrationEventTopics.account.activation.requested,
            IntegrationEventTopics.account.password.resetRequested,
            IntegrationEventTopics.account.password.updated,
            IntegrationEventTopics.account.activation.completed,
            IntegrationEventTopics.account.removal.completed,
            IntegrationEventTopics.account.removal.scheduled,
            IntegrationEventTopics.alert.daily.reminder.triggered,
            IntegrationEventTopics.twoFactorAuth.email.issued,
        ]);
    }
}
