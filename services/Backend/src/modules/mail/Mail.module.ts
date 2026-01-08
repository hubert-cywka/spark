import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { DatabaseModule } from "@/common/database/Database.module";
import { type IInboxEventHandler, InboxEventHandlersToken, IntegrationEvents, IntegrationEventsModule } from "@/common/events";
import {
    type IIntegrationEventsJobsOrchestrator,
    IntegrationEventsJobsOrchestratorToken,
} from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import {
    type IIntegrationEventsSubscriber,
    IntegrationEventsSubscriberToken,
} from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { HealthCheckModule } from "@/modules/healthcheck/HealthCheck.module";
import {
    type IHealthCheckProbesRegistry,
    HealthCheckProbesRegistryToken,
} from "@/modules/healthcheck/services/interfaces/IHealthCheckProbesRegistry";
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
import { TimestampsPrecisionMail1767888117896 } from "@/modules/mail/infrastructure/database/migrations/1767888117896-timestamps-precision-mail";
import { RecipientMapperToken } from "@/modules/mail/mappers/IRecipient.mapper";
import { RecipientMapper } from "@/modules/mail/mappers/Recipient.mapper";
import { EmailLookup } from "@/modules/mail/services/implementations/EmailLookup";
import { RecipientService } from "@/modules/mail/services/implementations/RecipientService";
import { ResendMailSender } from "@/modules/mail/services/implementations/ResendMailSender";
import { EmailLookupToken } from "@/modules/mail/services/interfaces/IEmailLookup";
import { MailSenderToken } from "@/modules/mail/services/interfaces/IMailSender";
import { RecipientServiceToken } from "@/modules/mail/services/interfaces/IRecipientService";
import { HtmlEmailTemplateFactory } from "@/modules/mail/templates/html/HtmlEmailTemplate.factory";
import { EmailTemplateFactoryToken } from "@/modules/mail/templates/IEmailTemplate.factory";

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
            useClass: ResendMailSender,
        },
        {
            provide: EmailTemplateFactoryToken,
            useClass: HtmlEmailTemplateFactory,
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
                    ...IntegrationEventsModule.getMigrations(),
                    RegenerateMigrations1749289938815,
                    AddTimestamps1752925904452,
                    TimestampsPrecisionMail1767888117896,
                ],
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
        HealthCheckModule,
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
        private readonly handlers: IInboxEventHandler[],
        @InjectDataSource(MAIL_MODULE_DATA_SOURCE)
        private readonly dataSource: DataSource,
        @Inject(HealthCheckProbesRegistryToken)
        private readonly healthCheckProbesService: IHealthCheckProbesRegistry
    ) {}

    public onModuleInit() {
        this.healthCheckProbesService.registerDatabaseConnectionProbe(`database_${MAIL_MODULE_DATA_SOURCE}`, this.dataSource);

        this.orchestrator.startProcessingInbox(this.handlers);
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingInbox();
        this.orchestrator.startClearingOutbox();

        void this.subscriber.listen([
            IntegrationEvents.account.activation.requested,
            IntegrationEvents.account.password.resetRequested,
            IntegrationEvents.account.password.updated,
            IntegrationEvents.account.activation.completed,
            IntegrationEvents.account.removal.completed,
            IntegrationEvents.account.removal.scheduled,
            IntegrationEvents.alert.daily.reminder.triggered,
            IntegrationEvents.twoFactorAuth.email.issued,
        ]);
    }
}
