import { INestApplication } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";
import { initializeTransactionalContext, runInTransaction } from "typeorm-transactional";

import { DatabaseModule } from "@/common/database/Database.module";
import {
    EventInboxToken,
    EventPublisherToken,
    IEventInbox,
    IEventPublisher,
    IntegrationEvent,
    IntegrationEventsModule,
} from "@/common/events";
import { EventAdminToken, IEventAdmin } from "@/common/events/drivers/interfaces/IEventAdmin";
import { EventProducerToken, IEventProducer } from "@/common/events/drivers/interfaces/IEventProducer";
import { IInboxEventRepository, InboxEventRepositoryToken } from "@/common/events/repositories/interfaces/IInboxEvent.repository";
import {
    IInboxPartitionRepository,
    InboxPartitionRepositoryToken,
} from "@/common/events/repositories/interfaces/IInboxPartition.repository";
import { IOutboxEventRepository, OutboxEventRepositoryToken } from "@/common/events/repositories/interfaces/IOutboxEvent.repository";
import {
    IOutboxPartitionRepository,
    OutboxPartitionRepositoryToken,
} from "@/common/events/repositories/interfaces/IOutboxPartition.repository";
import { EventInboxProcessorToken, IEventInboxProcessor } from "@/common/events/services/interfaces/IEventInboxProcessor";
import { EventOutboxToken, IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import { EventOutboxProcessorToken, IEventOutboxProcessor } from "@/common/events/services/interfaces/IEventOutboxProcessor";
import { generateEvents } from "@/common/events/tests/utils/generateEvents";
import { groupEventsByPartitionKey } from "@/common/events/tests/utils/groupEventsByPartitionKey";
import { seedPartitions } from "@/common/events/tests/utils/seedPartitions";
import { TestEvent } from "@/common/events/tests/utils/TestEvent";
import { TestEventHandler } from "@/common/events/tests/utils/TestEventHandler";
import { TestEventEnqueueSubscriber } from "@/common/events/tests/utils/TestEventSubscriber";
import { DBConnectionOptions, dropDatabase } from "@/common/utils/databaseUtils";
import { wait } from "@/common/utils/timeUtils";
import { TestConfig } from "@/config/testConfiguration";
import { loggerOptions } from "@/lib/logger";
import { GlobalModule } from "@/modules/global/Global.module";

describe("IntegrationEventsModule", () => {
    const TEST_ID = "integration_events_module_test";
    const DATABASE_NAME = `__${TEST_ID}_${Date.now()}`;
    const EVENT_TOPIC = "account";
    const EVENT_SUBJECT = `${EVENT_TOPIC}.${TEST_ID}`;

    let dbOptions: DBConnectionOptions;
    let app: INestApplication;

    jest.setTimeout(30 * 1000);

    beforeAll(async () => {
        initializeTransactionalContext();

        const moduleRef = await Test.createTestingModule({
            imports: [
                GlobalModule,
                LoggerModule.forRoot({ pinoHttp: loggerOptions }),
                ScheduleModule.forRoot(),
                await ConfigModule.forRoot({
                    load: [TestConfig],
                    isGlobal: true,
                }),
                DatabaseModule.forRootAsync(TEST_ID, {
                    useFactory: (configService: ConfigService) => {
                        dbOptions = {
                            database: DATABASE_NAME,
                            port: configService.getOrThrow<number>("modules.alerts.database.port"),
                            username: configService.getOrThrow<string>("modules.alerts.database.username"),
                            password: configService.getOrThrow<string>("modules.alerts.database.password"),
                            host: configService.getOrThrow<string>("modules.alerts.database.host"),
                        };

                        return {
                            ...dbOptions,
                            logging: false,
                            synchronize: true,
                        };
                    },
                    inject: [ConfigService],
                }),
                IntegrationEventsModule.forRootAsync({
                    useFactory: (configService: ConfigService) => {
                        return {
                            clientId: TEST_ID,
                            brokers: configService.getOrThrow<string[]>("pubsub.brokers"),
                        };
                    },
                    global: true,
                    inject: [ConfigService],
                }),
                IntegrationEventsModule.forFeatureAsync({
                    context: TEST_ID,
                    consumerGroupId: TEST_ID,
                    connectionName: TEST_ID,
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
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        await seedPartitions(app, TEST_ID);
    });

    afterAll(async () => {
        jest.clearAllMocks();
        await dropDatabase(dbOptions, DATABASE_NAME, {
            baseInterval: 1000,
            maxAttempts: 10,
        });
        await app.close();
    });

    describe("Publisher", () => {
        const tenantId = crypto.randomUUID();

        const setup = () => {
            const admin = app.get<IEventAdmin>(EventAdminToken);
            const publisher = app.get<IEventPublisher>(EventPublisherToken);
            const outbox = app.get<IEventOutbox>(EventOutboxToken);
            const repository = app.get<IOutboxEventRepository>(OutboxEventRepositoryToken);
            const subscriber = new TestEventEnqueueSubscriber();
            return { outbox, repository, subscriber, admin, publisher };
        };

        beforeEach(async () => {
            const { repository } = setup();
            await repository.removeAll();
        });

        afterEach(async () => {
            const { admin } = setup();
            await admin.purgeTopic(EVENT_TOPIC);
        });

        it("should save enqueued event in persistent storage", async () => {
            const eventToEnqueue = new TestEvent(EVENT_TOPIC, EVENT_SUBJECT, tenantId);
            const { outbox, repository } = setup();

            await outbox.enqueue(eventToEnqueue);
            const eventFromRepository = await repository.getById(eventToEnqueue.getId());

            expect(eventFromRepository?.id).toBe(eventToEnqueue.getId());
            expect(eventFromRepository?.tenantId).toBe(eventToEnqueue.getTenantId());
            expect(eventFromRepository?.payload).toStrictEqual(eventToEnqueue.getPayload());
        });

        it("should not save event if transaction failed", async () => {
            const eventToEnqueue = new TestEvent(EVENT_TOPIC, EVENT_SUBJECT, tenantId);
            const { outbox, repository } = setup();

            try {
                await runInTransaction(
                    async () => {
                        await outbox.enqueue(eventToEnqueue);
                        throw new Error();
                    },
                    { connectionName: TEST_ID }
                );
            } catch (err) {
                // Ignore
            }
            const eventFromRepository = await repository.getById(eventToEnqueue.getId());

            expect(eventFromRepository).toBeNull();
        });

        it("should encrypt event payload if requested", async () => {
            const eventToEnqueue = new TestEvent(EVENT_TOPIC, EVENT_SUBJECT, tenantId);
            const { publisher, repository } = setup();

            await publisher.enqueue(eventToEnqueue, { encrypt: true });
            const eventFromRepository = await repository.getById(eventToEnqueue.getId());

            expect(eventFromRepository?.id).toBe(eventToEnqueue.getId());
            expect(eventFromRepository?.payload).not.toStrictEqual(eventToEnqueue.getPayload());
        });

        it("should inform subscribers when event is enqueued", async () => {
            const eventToEnqueue = new TestEvent(EVENT_TOPIC, EVENT_SUBJECT, tenantId);
            const { outbox, subscriber } = setup();
            jest.spyOn(subscriber, "notifyOnEnqueued");

            outbox.subscribe(subscriber);
            await outbox.enqueue(eventToEnqueue);
            await wait(100);

            expect(subscriber.notifyOnEnqueued).toHaveBeenCalledTimes(1);
            expect(subscriber.notifyOnEnqueued).toHaveBeenCalledWith(eventToEnqueue);
        });
    });

    describe("Inbox", () => {
        const tenantId = crypto.randomUUID();

        const setup = () => {
            const admin = app.get<IEventAdmin>(EventAdminToken);
            const inbox = app.get<IEventInbox>(EventInboxToken);
            const repository = app.get<IInboxEventRepository>(InboxEventRepositoryToken);
            const subscriber = new TestEventEnqueueSubscriber();
            return { inbox, repository, subscriber, admin };
        };

        beforeEach(async () => {
            const { repository } = setup();
            await repository.removeAll();
        });

        afterEach(async () => {
            const { admin } = setup();
            await admin.purgeTopic(EVENT_TOPIC);
        });

        it("should save enqueued event in persistent storage", async () => {
            const eventToEnqueue = new TestEvent(EVENT_TOPIC, EVENT_SUBJECT, tenantId);
            const { inbox, repository } = setup();

            await inbox.enqueue(eventToEnqueue);
            const eventFromRepository = await repository.getById(eventToEnqueue.getId());

            expect(eventFromRepository?.id).toBe(eventToEnqueue.getId());
            expect(eventFromRepository?.tenantId).toBe(eventToEnqueue.getTenantId());
            expect(eventFromRepository?.payload).toStrictEqual(eventToEnqueue.getPayload());
        });

        it("should not save event if transaction failed", async () => {
            const eventToEnqueue = new TestEvent(EVENT_TOPIC, EVENT_SUBJECT, tenantId);
            const { inbox, repository } = setup();

            try {
                await runInTransaction(
                    async () => {
                        await inbox.enqueue(eventToEnqueue);
                        throw new Error();
                    },
                    { connectionName: TEST_ID }
                );
            } catch (err) {
                // Ignore
            }
            const eventFromRepository = await repository.getById(eventToEnqueue.getId());

            expect(eventFromRepository).toBeNull();
        });

        it("should allow to enqueue events in bulk", async () => {
            const firstEvent = new TestEvent(EVENT_TOPIC, EVENT_SUBJECT, tenantId);
            const secondEvent = new TestEvent(EVENT_TOPIC, EVENT_SUBJECT, tenantId);
            const { inbox, repository } = setup();

            await inbox.enqueueMany([firstEvent, secondEvent]);
            const firstEventFromRepository = await repository.getById(firstEvent.getId());
            const secondEventFromRepository = await repository.getById(secondEvent.getId());

            expect(firstEventFromRepository?.id).toBe(firstEvent.getId());
            expect(secondEventFromRepository?.id).toBe(secondEvent.getId());
        });

        it("should inform subscribers about every event enqueued in bulk", async () => {
            const firstEvent = new TestEvent(EVENT_TOPIC, EVENT_SUBJECT, tenantId);
            const secondEvent = new TestEvent(EVENT_TOPIC, EVENT_SUBJECT, tenantId);
            const { inbox, subscriber } = setup();
            jest.spyOn(subscriber, "notifyOnEnqueued");

            inbox.subscribe(subscriber);
            await inbox.enqueueMany([firstEvent, secondEvent]);
            await wait(100);

            expect(subscriber.notifyOnEnqueued).toHaveBeenCalledTimes(2);
            expect(subscriber.notifyOnEnqueued).toHaveBeenCalledWith(firstEvent);
            expect(subscriber.notifyOnEnqueued).toHaveBeenCalledWith(secondEvent);
        });
    });

    describe("OutboxProcessor", () => {
        const setup = () => {
            const admin = app.get<IEventAdmin>(EventAdminToken);
            const producer = app.get<IEventProducer>(EventProducerToken);
            const outbox = app.get<IEventOutbox>(EventOutboxToken);
            const processor = app.get<IEventOutboxProcessor>(EventOutboxProcessorToken);
            const eventRepository = app.get<IOutboxEventRepository>(OutboxEventRepositoryToken);
            const partitionRepository = app.get<IOutboxPartitionRepository>(OutboxPartitionRepositoryToken);
            return {
                outbox,
                eventRepository,
                partitionRepository,
                processor,
                producer,
                admin,
            };
        };

        const seedData = async ({ numOfTenants, eventsPerTenant }: { numOfTenants: number; eventsPerTenant: number }) => {
            const { outbox } = setup();
            const events = generateEvents(numOfTenants, eventsPerTenant, EVENT_TOPIC);
            await outbox.enqueueMany(events);
            return {
                events,
                numOfTenants,
                eventsPerTenant,
                seededEventsCount: numOfTenants * eventsPerTenant,
            };
        };

        beforeEach(async () => {
            const { eventRepository, partitionRepository } = setup();
            await eventRepository.removeAll();
            await partitionRepository.invalidateAll();
        });

        afterEach(async () => {
            const { admin } = setup();
            await admin.purgeTopic(EVENT_TOPIC);
        });

        it("should process all enqueued events", async () => {
            const { processor, eventRepository } = setup();
            const { seededEventsCount } = await seedData({
                numOfTenants: 10,
                eventsPerTenant: 100,
            });

            const unprocessedBefore = await eventRepository.countUnprocessed();
            await processor.processPendingEvents();
            const unprocessedAfter = await eventRepository.countUnprocessed();

            expect(unprocessedBefore).toBe(seededEventsCount);
            expect(unprocessedAfter).toBe(0);
        });

        it("should process all events when processing in parallel", async () => {
            const { processor, eventRepository } = setup();
            const { seededEventsCount } = await seedData({
                numOfTenants: 50,
                eventsPerTenant: 100,
            });

            const unprocessedBefore = await eventRepository.countUnprocessed();
            await Promise.all([processor.processPendingEvents(), processor.processPendingEvents(), processor.processPendingEvents()]);
            const unprocessedAfter = await eventRepository.countUnprocessed();

            expect(unprocessedBefore).toBe(seededEventsCount);
            expect(unprocessedAfter).toBe(0);
        });

        it("should maintain order of events when processing in parallel", async () => {
            const { processor, producer } = setup();

            const eventsInProcessingOrder: IntegrationEvent[] = [];
            jest.spyOn(producer, "publishBatch").mockImplementation(async (events) => {
                eventsInProcessingOrder.push(...events);
                return { ack: true };
            });

            const { seededEventsCount } = await seedData({
                numOfTenants: 13,
                eventsPerTenant: 505,
            });

            await Promise.all([
                processor.processPendingEvents(),
                processor.processPendingEvents(),
                processor.processPendingEvents(),
                processor.processPendingEvents(),
                processor.processPendingEvents(),
            ]);

            expect(eventsInProcessingOrder.length).toBe(seededEventsCount);
            const eventsInProcessingOrderByPartitionKey = groupEventsByPartitionKey(eventsInProcessingOrder);

            for (const [_, processedEvents] of Object.entries(eventsInProcessingOrderByPartitionKey)) {
                let previous = null;

                for (const event of processedEvents) {
                    if (previous) {
                        expect(event.getPartitionKey()).toBe(previous.getPartitionKey());
                        expect(event.getCreatedAt().getTime()).toBeGreaterThanOrEqual(previous.getCreatedAt().getTime());
                    }

                    previous = event;
                }
            }
        });

        it("should stop whole processing on first failure", async () => {
            const { processor, eventRepository, producer } = setup();
            const { seededEventsCount } = await seedData({
                numOfTenants: 10,
                eventsPerTenant: 10,
            });

            let processedMessagesCounter = 0;
            const consecutiveAttemptToFail = 13;
            jest.spyOn(producer, "publishBatch").mockImplementation(async () => {
                if (processedMessagesCounter === consecutiveAttemptToFail) {
                    throw new Error();
                }

                processedMessagesCounter++;
                return { ack: true };
            });

            const unprocessedBefore = await eventRepository.countUnprocessed();
            await processor.processPendingEvents();
            const unprocessedAfter = await eventRepository.countUnprocessed();

            expect(unprocessedBefore).toBe(seededEventsCount);
            expect(unprocessedAfter).toBe(seededEventsCount - consecutiveAttemptToFail);
        });

        it("should recover after failure and process remaining messages on next iteration", async () => {
            const { processor, eventRepository, producer } = setup();
            const { seededEventsCount } = await seedData({
                numOfTenants: 10,
                eventsPerTenant: 10,
            });

            let processedMessagesCounter = 0;
            const consecutiveAttemptToFail = 16;
            jest.spyOn(producer, "publishBatch").mockImplementation(async () => {
                if (processedMessagesCounter === consecutiveAttemptToFail) {
                    throw new Error();
                }

                processedMessagesCounter++;
                return { ack: true };
            });

            const unprocessedBefore = await eventRepository.countUnprocessed();
            await processor.processPendingEvents();
            jest.resetAllMocks();
            await processor.processPendingEvents();
            const unprocessedAfter = await eventRepository.countUnprocessed();

            expect(unprocessedBefore).toBe(seededEventsCount);
            expect(unprocessedAfter).toBe(0);
        });
    });

    // eslint-disable-next-line sonarjs/cognitive-complexity
    describe("InboxProcessor", () => {
        const setup = () => {
            const admin = app.get<IEventAdmin>(EventAdminToken);
            const inbox = app.get<IEventInbox>(EventInboxToken);
            const processor = app.get<IEventInboxProcessor>(EventInboxProcessorToken);
            const eventRepository = app.get<IInboxEventRepository>(InboxEventRepositoryToken);
            const partitionRepository = app.get<IInboxPartitionRepository>(InboxPartitionRepositoryToken);
            const eventHandler = new TestEventHandler();
            return {
                inbox,
                eventRepository,
                partitionRepository,
                processor,
                eventHandler,
                admin,
            };
        };

        const seedData = async ({ numOfTenants, eventsPerTenant }: { numOfTenants: number; eventsPerTenant: number }) => {
            const { inbox } = setup();
            const events = generateEvents(numOfTenants, eventsPerTenant, EVENT_TOPIC);
            await inbox.enqueueMany(events);
            return {
                numOfTenants,
                eventsPerTenant,
                seededEventsCount: numOfTenants * eventsPerTenant,
                events,
            };
        };

        beforeEach(async () => {
            const { eventRepository, partitionRepository } = setup();
            await eventRepository.removeAll();
            await partitionRepository.invalidateAll();
        });

        afterEach(async () => {
            const { admin } = setup();
            await admin.purgeTopic(EVENT_TOPIC);
        });

        it("should process all enqueued events", async () => {
            const { processor, eventRepository, eventHandler } = setup();
            jest.spyOn(eventHandler, "handle");
            processor.setEventHandlers([eventHandler]);
            const { seededEventsCount } = await seedData({
                numOfTenants: 17,
                eventsPerTenant: 12,
            });

            const unprocessedBefore = await eventRepository.countUnprocessed();
            await processor.processPendingEvents();
            const unprocessedAfter = await eventRepository.countUnprocessed();

            expect(unprocessedBefore).toBe(seededEventsCount);
            expect(unprocessedAfter).toBe(0);
            expect(eventHandler.handle).toHaveBeenCalledTimes(seededEventsCount);
        });

        it("should process all events when processing in parallel", async () => {
            const { processor, eventRepository, eventHandler } = setup();
            jest.spyOn(eventHandler, "handle");
            processor.setEventHandlers([eventHandler]);
            const { seededEventsCount } = await seedData({
                numOfTenants: 19,
                eventsPerTenant: 11,
            });

            const unprocessedBefore = await eventRepository.countUnprocessed();
            await Promise.all([processor.processPendingEvents(), processor.processPendingEvents(), processor.processPendingEvents()]);
            const unprocessedAfter = await eventRepository.countUnprocessed();

            expect(unprocessedBefore).toBe(seededEventsCount);
            expect(unprocessedAfter).toBe(0);
            expect(eventHandler.handle).toHaveBeenCalledTimes(seededEventsCount);
        });

        it("should maintain order of events when processing in parallel", async () => {
            const { processor, eventHandler } = setup();
            processor.setEventHandlers([eventHandler]);

            const eventsInProcessingOrder: IntegrationEvent[] = [];
            jest.spyOn(eventHandler, "handle").mockImplementation(async (event) => {
                eventsInProcessingOrder.push(event);
            });

            const { seededEventsCount, events } = await seedData({
                numOfTenants: 19,
                eventsPerTenant: 23,
            });

            await Promise.all([
                processor.processPendingEvents(),
                processor.processPendingEvents(),
                processor.processPendingEvents(),
                processor.processPendingEvents(),
                processor.processPendingEvents(),
            ]);

            expect(eventsInProcessingOrder.length).toBe(seededEventsCount);
            const eventsInProcessingOrderByPartitionKey = groupEventsByPartitionKey(eventsInProcessingOrder);

            for (const [_, processedEvents] of Object.entries(eventsInProcessingOrderByPartitionKey)) {
                let previous = null;

                for (const event of processedEvents) {
                    if (previous) {
                        expect(event.getPartitionKey()).toBe(previous.getPartitionKey());
                        expect(event.getCreatedAt().getTime()).toBeGreaterThanOrEqual(previous.getCreatedAt().getTime());
                    }

                    previous = event;
                }
            }
        });

        it("should skip events with the same partition key in current iteration after processing one of them failed", async () => {
            const { processor, eventRepository, eventHandler } = setup();
            const { seededEventsCount, events, eventsPerTenant } = await seedData({
                numOfTenants: 14,
                eventsPerTenant: 7,
            });
            processor.setEventHandlers([eventHandler]);

            let poisonPartitionKey: string | null = events[10].getPartitionKey();
            let processedMessagesCounter = 0;
            const consecutiveAttemptToFail = 3;
            jest.spyOn(eventHandler, "handle").mockImplementation(async (eventToHandle) => {
                if (eventToHandle.getPartitionKey() === poisonPartitionKey) {
                    processedMessagesCounter++;

                    if (processedMessagesCounter === consecutiveAttemptToFail) {
                        poisonPartitionKey = null;
                        throw new Error();
                    }
                }
            });

            const unprocessedBefore = await eventRepository.countUnprocessed();
            await processor.processPendingEvents();
            const unprocessedAfter = await eventRepository.countUnprocessed();

            const unprocessedEventsWithPoisonedPartitionKey = eventsPerTenant - consecutiveAttemptToFail + 1;
            expect(unprocessedBefore).toBe(seededEventsCount);
            expect(unprocessedAfter).toBe(unprocessedEventsWithPoisonedPartitionKey);
        });

        it("should skip events with the same partition key in next iteration after processing one of them failed", async () => {
            const { processor, eventRepository, eventHandler } = setup();
            const { seededEventsCount, eventsPerTenant } = await seedData({
                numOfTenants: 1,
                eventsPerTenant: 11,
            });
            processor.setEventHandlers([eventHandler]);

            let processedMessagesCounter = 0;
            const consecutiveAttemptToFail = 3;
            jest.spyOn(eventHandler, "handle").mockImplementation(async () => {
                processedMessagesCounter++;

                if (processedMessagesCounter === consecutiveAttemptToFail) {
                    throw new Error();
                }
            });

            const unprocessedBefore = await eventRepository.countUnprocessed();
            await processor.processPendingEvents();
            const unprocessedMiddle = await eventRepository.countUnprocessed();
            jest.resetAllMocks();
            await processor.processPendingEvents();
            const unprocessedAfter = await eventRepository.countUnprocessed();

            const unprocessedEventsWithPoisonedPartitionKey = eventsPerTenant - consecutiveAttemptToFail + 1;
            expect(unprocessedBefore).toBe(seededEventsCount);
            expect(unprocessedAfter).toBe(unprocessedEventsWithPoisonedPartitionKey);
            expect(unprocessedAfter).toBe(unprocessedMiddle);
        });
    });
});
