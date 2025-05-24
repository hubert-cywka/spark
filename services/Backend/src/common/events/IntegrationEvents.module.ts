import { type DynamicModule, Module } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";

import { NatsJetStreamModule, NatsJetStreamModuleOptions } from "@/common/events/brokers/NatsJetStream.module";
import { EventInbox } from "@/common/events/services/implementations/EventInbox";
import { EventOutbox } from "@/common/events/services/implementations/EventOutbox";
import { EventsRemover } from "@/common/events/services/implementations/EventsRemover";
import { IntegrationEventsEncryptionService } from "@/common/events/services/implementations/IntegrationEventsEncryption.service";
import { IntegrationEventsJobsOrchestrator } from "@/common/events/services/implementations/IntegrationEventsJobsOrchestrator";
import { IntegrationEventsSubscriber } from "@/common/events/services/implementations/IntegrationEventsSubscriber";
import { type IEventBoxFactory, EventBoxFactoryToken } from "@/common/events/services/interfaces/IEventBox.factory";
import { EventInboxToken } from "@/common/events/services/interfaces/IEventInbox";
import { EventInboxOptionsToken } from "@/common/events/services/interfaces/IEventInboxOptions";
import { EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { EventOutboxOptionsToken, IEventOutboxOptions } from "@/common/events/services/interfaces/IEventOutboxOptions";
import { type IEventsRemover, EventsRemoverToken } from "@/common/events/services/interfaces/IEventsRemover";
import {
    IIntegrationEventsEncryptionService,
    IntegrationEventsEncryptionServiceToken,
} from "@/common/events/services/interfaces/IIntegrationEventsEncryption.service";
import { IntegrationEventsJobsOrchestratorToken } from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import { IntegrationEventsSubscriberToken } from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { IPubSubProducer, PubSubProducerToken } from "@/common/events/services/interfaces/IPubSubProducer";
import { IntegrationEventsModuleOptions } from "@/common/events/types";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const IntegrationEventsModuleOptionsToken = Symbol("IntegrationEventsModuleOptions");

@Module({})
export class IntegrationEventsModule {
    static forRootAsync(options: {
        useFactory: UseFactory<IntegrationEventsModuleOptions<NatsJetStreamModuleOptions>>;
        inject?: UseFactoryArgs;
        global?: boolean;
    }): DynamicModule {
        return {
            module: IntegrationEventsModule,
            providers: [
                {
                    provide: IntegrationEventsModuleOptionsToken,
                    useFactory: options.useFactory,
                    inject: options.inject ?? [],
                },
            ],
            imports: [NatsJetStreamModule.forRootAsync(options)],
            exports: [IntegrationEventsModuleOptionsToken],
            global: options.global,
        };
    }

    static forFeature({
        eventBoxFactory,
        context,
    }: {
        context: string;
        eventBoxFactory: {
            useClass: ClassConstructor<IEventBoxFactory>;
        };
    }): DynamicModule {
        return {
            module: IntegrationEventsModule,
            providers: [
                {
                    provide: EventBoxFactoryToken,
                    useClass: eventBoxFactory.useClass,
                },

                {
                    provide: EventsRemoverToken,
                    useClass: EventsRemover,
                },

                {
                    provide: EventOutboxOptionsToken,
                    useFactory: (factory: IEventBoxFactory) => factory.createOutboxOptions(`${context}_Outbox`),
                    inject: [EventBoxFactoryToken],
                },

                {
                    provide: EventInboxOptionsToken,
                    useFactory: (factory: IEventBoxFactory) => factory.createInboxOptions(`${context}_Inbox`),
                    inject: [EventBoxFactoryToken],
                },

                {
                    provide: EventOutboxToken,
                    useFactory: (
                        options: IEventOutboxOptions,
                        producer: IPubSubProducer,
                        eventsRemover: IEventsRemover,
                        encryptionService: IIntegrationEventsEncryptionService
                    ) => new EventOutbox(options, producer, eventsRemover, encryptionService),
                    inject: [EventBoxFactoryToken, PubSubProducerToken, EventsRemoverToken, IntegrationEventsEncryptionServiceToken],
                },

                {
                    provide: EventInboxToken,
                    useFactory: (
                        options: IEventOutboxOptions,
                        producer: IPubSubProducer,
                        eventsRemover: IEventsRemover,
                        encryptionService: IIntegrationEventsEncryptionService
                    ) => new EventInbox(options, producer, eventsRemover, encryptionService),
                    inject: [EventBoxFactoryToken, PubSubProducerToken, EventsRemoverToken, IntegrationEventsEncryptionServiceToken],
                },

                {
                    provide: IntegrationEventsSubscriberToken,
                    useClass: IntegrationEventsSubscriber,
                },

                {
                    provide: IntegrationEventsJobsOrchestratorToken,
                    useClass: IntegrationEventsJobsOrchestrator,
                },
                {
                    provide: IntegrationEventsEncryptionServiceToken,
                    useClass: IntegrationEventsEncryptionService,
                },
            ],

            exports: [EventOutboxToken, EventInboxToken, IntegrationEventsSubscriberToken, IntegrationEventsJobsOrchestratorToken],
        };
    }
}
