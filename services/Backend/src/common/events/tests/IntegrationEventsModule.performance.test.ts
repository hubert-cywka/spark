import { INestApplication } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";
import { initializeTransactionalContext } from "typeorm-transactional";

import { DatabaseModule } from "@/common/database/Database.module";
import {
  EventInboxToken,
  EventOutboxToken,
  IEventInbox,
  IEventOutbox,
  IntegrationEventsModule,
} from "@/common/events";
import {
  EventAdminToken,
  IEventAdmin,
} from "@/common/events/drivers/interfaces/IEventAdmin";
import {
  IInboxEventRepository,
  InboxEventRepositoryToken,
} from "@/common/events/repositories/interfaces/IInboxEvent.repository";
import {
  IInboxPartitionRepository,
  InboxPartitionRepositoryToken,
} from "@/common/events/repositories/interfaces/IInboxPartition.repository";
import {
  IOutboxEventRepository,
  OutboxEventRepositoryToken,
} from "@/common/events/repositories/interfaces/IOutboxEvent.repository";
import {
  IOutboxPartitionRepository,
  OutboxPartitionRepositoryToken,
} from "@/common/events/repositories/interfaces/IOutboxPartition.repository";
import {
  EventInboxProcessorToken,
  IEventInboxProcessor,
} from "@/common/events/services/interfaces/IEventInboxProcessor";
import {
  EventOutboxProcessorToken,
  IEventOutboxProcessor,
} from "@/common/events/services/interfaces/IEventOutboxProcessor";
import { generateEvents } from "@/common/events/tests/utils/generateEvents";
import { seedPartitions } from "@/common/events/tests/utils/seedPartitions";
import { TestEventHandler } from "@/common/events/tests/utils/TestEventHandler";
import {
  DBConnectionOptions,
  dropDatabase,
} from "@/common/utils/databaseUtils";
import { TestConfig } from "@/config/testConfiguration";
import { loggerOptions } from "@/lib/logger";
import { GlobalModule } from "@/modules/global/Global.module";

// TODO: These are not proper performance tests - it's rather a benchmark which was used to fine tune the current
//  implementation.
describe("IntegrationEventsModule", () => {
  const TEST_ID = "integration_events_module_test";
  const DATABASE_NAME = `__${TEST_ID}_${Date.now()}`;
  const EVENT_TOPIC = "account";

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
              port: configService.getOrThrow<number>(
                "modules.alerts.database.port",
              ),
              username: configService.getOrThrow<string>(
                "modules.alerts.database.username",
              ),
              password: configService.getOrThrow<string>(
                "modules.alerts.database.password",
              ),
              host: configService.getOrThrow<string>(
                "modules.alerts.database.host",
              ),
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
              maxAttempts: configService.getOrThrow<number>(
                "events.inbox.processing.maxAttempts",
              ),
              maxBatchSize: configService.getOrThrow<number>(
                "events.inbox.processing.maxBatchSize",
              ),
            },
            outboxProcessorOptions: {
              maxAttempts: configService.getOrThrow<number>(
                "events.outbox.processing.maxAttempts",
              ),
              maxBatchSize: configService.getOrThrow<number>(
                "events.outbox.processing.maxBatchSize",
              ),
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

  describe.skip("Performance tests", () => {
    const setup = () => {
      const admin = app.get<IEventAdmin>(EventAdminToken);
      const inbox = app.get<IEventInbox>(EventInboxToken);
      const outbox = app.get<IEventOutbox>(EventOutboxToken);

      const outboxProcessor = app.get<IEventOutboxProcessor>(
        EventOutboxProcessorToken,
      );
      const inboxProcessor = app.get<IEventInboxProcessor>(
        EventInboxProcessorToken,
      );

      const outboxEventRepository = app.get<IOutboxEventRepository>(
        OutboxEventRepositoryToken,
      );
      const inboxEventRepository = app.get<IInboxEventRepository>(
        InboxEventRepositoryToken,
      );

      const outboxPartitionRepository = app.get<IOutboxPartitionRepository>(
        OutboxPartitionRepositoryToken,
      );
      const inboxPartitionRepository = app.get<IInboxPartitionRepository>(
        InboxPartitionRepositoryToken,
      );

      const config = app.get<ConfigService>(ConfigService);
      const eventHandler = new TestEventHandler();
      return {
        inbox,
        outbox,
        outboxProcessor,
        inboxProcessor,
        outboxEventRepository,
        inboxEventRepository,
        outboxPartitionRepository,
        inboxPartitionRepository,
        eventHandler,
        admin,
        config,
      };
    };

    const seedOutbox = async ({
      numOfTenants,
      eventsPerTenant,
    }: {
      numOfTenants: number;
      eventsPerTenant: number;
    }) => {
      const events = generateEvents(numOfTenants, eventsPerTenant, EVENT_TOPIC);
      const { outbox } = setup();
      await outbox.enqueueMany(events);
      return {
        numOfTenants,
        eventsPerTenant,
        seededEventsCount: numOfTenants * eventsPerTenant,
        events,
      };
    };

    const seedInbox = async ({
      numOfTenants,
      eventsPerTenant,
    }: {
      numOfTenants: number;
      eventsPerTenant: number;
    }) => {
      const events = generateEvents(numOfTenants, eventsPerTenant, EVENT_TOPIC);
      const { inbox } = setup();
      await inbox.enqueueMany(events);
      return {
        numOfTenants,
        eventsPerTenant,
        seededEventsCount: numOfTenants * eventsPerTenant,
        events,
      };
    };

    beforeEach(async () => {
      const {
        inboxEventRepository,
        outboxEventRepository,
        outboxPartitionRepository,
        inboxPartitionRepository,
      } = setup();
      await inboxEventRepository.removeAll();
      await inboxPartitionRepository.invalidateAll();
      await outboxEventRepository.removeAll();
      await outboxPartitionRepository.invalidateAll();
    });

    afterEach(async () => {
      const { admin } = setup();
      await admin.purgeTopic(EVENT_TOPIC);
    });

    it("outbox processing performance test", async () => {
      const { outboxProcessor, outboxEventRepository } = setup();
      const parallelProcesses = 16;

      const seedingFactor = 500;
      const numOfTenants = 100;
      const eventsPerTenant = 20;

      for (let i = 0; i < seedingFactor; i++) {
        await seedOutbox({ numOfTenants, eventsPerTenant });
      }

      const unprocessedBefore = await outboxEventRepository.countUnprocessed();
      const promises = [];

      for (let i = 0; i < parallelProcesses; i++) {
        promises.push(outboxProcessor.processPendingEvents());
      }

      await Promise.all(promises);
      const unprocessedAfter = await outboxEventRepository.countUnprocessed();

      expect(unprocessedBefore).toBe(
        seedingFactor * numOfTenants * eventsPerTenant,
      );
      expect(unprocessedAfter).toBe(0);
    });

    it("inbox processing performance test", async () => {
      const { eventHandler, inboxProcessor, inboxEventRepository } = setup();
      inboxProcessor.setEventHandlers([eventHandler]);
      jest.spyOn(eventHandler, "handle");
      const parallelProcesses = 16;

      const seedingFactor = 100;
      const numOfTenants = 100;
      const eventsPerTenant = 25;

      for (let i = 0; i < seedingFactor; i++) {
        await seedInbox({ numOfTenants, eventsPerTenant });
      }

      const unprocessedBefore = await inboxEventRepository.countUnprocessed();
      const promises = [];

      for (let i = 0; i < parallelProcesses; i++) {
        promises.push(inboxProcessor.processPendingEvents());
      }

      await Promise.all(promises);

      expect(unprocessedBefore).toBe(
        seedingFactor * numOfTenants * eventsPerTenant,
      );
      expect(eventHandler.handle).toHaveBeenCalledTimes(
        seedingFactor * numOfTenants * eventsPerTenant,
      );
    });
  });
});
