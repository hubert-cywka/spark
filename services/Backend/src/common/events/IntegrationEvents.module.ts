import { type DynamicModule, Module } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DatabaseModule } from "@/common/database/Database.module";
import { NatsJetStreamModule, NatsJetStreamModuleOptions } from "@/common/events/brokers/NatsJetStream.module";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { EventInbox } from "@/common/events/services/implementations/EventInbox";
import { EventOutbox } from "@/common/events/services/implementations/EventOutbox";
import { EventsRemover } from "@/common/events/services/implementations/EventsRemover";
import { IntegrationEventsEncryptionService } from "@/common/events/services/implementations/IntegrationEventsEncryption.service";
import { IntegrationEventsJobsOrchestrator } from "@/common/events/services/implementations/IntegrationEventsJobsOrchestrator";
import { IntegrationEventsSubscriber } from "@/common/events/services/implementations/IntegrationEventsSubscriber";
import { EventInboxToken } from "@/common/events/services/interfaces/IEventInbox";
import { EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
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

    static forFeature({ context, connectionName }: { context: string; connectionName: string }): DynamicModule {
        return {
            module: IntegrationEventsModule,
            imports: [DatabaseModule.forFeature(connectionName, [InboxEventEntity, OutboxEventEntity])],
            providers: [
                {
                    provide: EventsRemoverToken,
                    useClass: EventsRemover,
                },

                {
                    provide: EventOutboxToken,
                    useFactory: async (
                        producer: IPubSubProducer,
                        eventsRemover: IEventsRemover,
                        encryptionService: IIntegrationEventsEncryptionService,
                        repository: Repository<OutboxEventEntity>
                    ) => new EventOutbox({ connectionName, context }, repository, producer, eventsRemover, encryptionService),
                    inject: [
                        PubSubProducerToken,
                        EventsRemoverToken,
                        IntegrationEventsEncryptionServiceToken,
                        getRepositoryToken(OutboxEventEntity, connectionName),
                    ],
                },

                {
                    provide: EventInboxToken,
                    useFactory: async (
                        producer: IPubSubProducer,
                        eventsRemover: IEventsRemover,
                        encryptionService: IIntegrationEventsEncryptionService,
                        repository: Repository<InboxEventEntity>
                    ) => new EventInbox({ connectionName, context }, repository, producer, eventsRemover, encryptionService),
                    inject: [
                        PubSubProducerToken,
                        EventsRemoverToken,
                        IntegrationEventsEncryptionServiceToken,
                        getRepositoryToken(InboxEventEntity, connectionName),
                    ],
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
