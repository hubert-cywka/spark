import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { randomUUID } from "node:crypto";
import { Repository } from "typeorm";
import { initializeTransactionalContext } from "typeorm-transactional";

import { DatabaseModule } from "@/common/database/Database.module";
import { DataExportScope } from "@/common/export/models/DataExportScope";
import { DataExportScopeDomain } from "@/common/export/types/DataExportScopeDomain";
import { DBConnectionOptions, dropDatabase } from "@/common/utils/databaseUtils";
import { TestConfig } from "@/config/testConfiguration";
import { DataExportEntity } from "@/modules/exports/entities/DataExport.entity";
import { DataPurgePlanEntity } from "@/modules/exports/entities/DataPurgePlan.entity";
import { ExportAttachmentManifestEntity } from "@/modules/exports/entities/ExportAttachmentManifest.entity";
import { TenantEntity } from "@/modules/exports/entities/Tenant.entity";
import { AnotherDataExportActiveError } from "@/modules/exports/errors/AnotherDataExportActiveError";
import { DataExportAlreadyCancelledError } from "@/modules/exports/errors/DataExportAlreadyCancelled.error";
import { DataExportAlreadyCompletedError } from "@/modules/exports/errors/DataExportAlreadyCompleted.error";
import { DataExportNotFoundError } from "@/modules/exports/errors/DataExportNotFound.error";
import { EXPORTS_MODULE_DATA_SOURCE } from "@/modules/exports/infrastructure/database/constants";
import { DataExportMapper } from "@/modules/exports/mappers/DataExport.mapper";
import { ExportAttachmentManifestMapper } from "@/modules/exports/mappers/ExportAttachmentManifest.mapper";
import { DataExportMapperToken } from "@/modules/exports/mappers/IDataExport.mapper";
import { ExportAttachmentManifestMapperToken } from "@/modules/exports/mappers/IExportAttachmentManifest.mapper";
import { DataExportService } from "@/modules/exports/services/implementations/DataExportService";
import { ExportAttachmentManifestService } from "@/modules/exports/services/implementations/ExportAttachmentManifestService";
import { ExportOrchestrator } from "@/modules/exports/services/implementations/ExportOrchestrator";
import { ExportScopeCalculator } from "@/modules/exports/services/implementations/ExportScopeCalculator";
import { NoOpExportEventsPublisher } from "@/modules/exports/services/implementations/NoOpExportEventsPublisher";
import { DataExportEventsPublisherToken } from "@/modules/exports/services/interfaces/IDataExportEventsPublisher";
import { DataExportServiceToken } from "@/modules/exports/services/interfaces/IDataExportService";
import { ExportAttachmentManifestServiceToken } from "@/modules/exports/services/interfaces/IExportAttachmentManifestService";
import { ExportScopeCalculatorToken } from "@/modules/exports/services/interfaces/IExportScopeCalculator";

// TODO: Clean up and update.
describe("ExportOrchestrator", () => {
    const TEST_ID = "export_orchestrator_integration";
    const DATABASE_NAME = `__${TEST_ID}_${Date.now()}`;
    const TENANT_ID = randomUUID();

    const SCOPE_A: DataExportScope = {
        domain: "users" as DataExportScopeDomain,
        dateRange: { from: "2025-01-01", to: "2025-05-30" },
    };

    const SCOPE_B: DataExportScope = {
        domain: "invoices" as DataExportScopeDomain,
        dateRange: { from: "2025-01-01", to: "2025-12-30" },
    };

    const PARTIAL_SCOPE_B: DataExportScope = {
        domain: "invoices" as DataExportScopeDomain,
        dateRange: { from: "2025-01-01", to: "2025-03-30" },
    };

    let app: TestingModule;
    let orchestrator: ExportOrchestrator;
    let dataExportRepository: Repository<DataExportEntity>;
    let attachmentRepository: Repository<ExportAttachmentManifestEntity>;
    let tenantRepository: Repository<TenantEntity>;
    let dbOptions: DBConnectionOptions;

    beforeAll(async () => {
        initializeTransactionalContext();

        app = await Test.createTestingModule({
            imports: [
                await ConfigModule.forRoot({ load: [TestConfig], isGlobal: true }),
                DatabaseModule.forRootAsync(EXPORTS_MODULE_DATA_SOURCE, {
                    useFactory: (configService: ConfigService) => {
                        dbOptions = {
                            database: DATABASE_NAME,
                            port: configService.getOrThrow<number>("modules.privacy.database.port"),
                            username: configService.getOrThrow<string>("modules.privacy.database.username"),
                            password: configService.getOrThrow<string>("modules.privacy.database.password"),
                            host: configService.getOrThrow<string>("modules.privacy.database.host"),
                        };
                        return { ...dbOptions, synchronize: true, logging: false };
                    },
                    inject: [ConfigService],
                }),
                DatabaseModule.forFeature(EXPORTS_MODULE_DATA_SOURCE, [
                    TenantEntity,
                    DataPurgePlanEntity,
                    DataExportEntity,
                    ExportAttachmentManifestEntity,
                ]),
            ],
            providers: [
                ExportOrchestrator,
                { provide: DataExportServiceToken, useClass: DataExportService },
                { provide: ExportAttachmentManifestServiceToken, useClass: ExportAttachmentManifestService },
                { provide: ExportScopeCalculatorToken, useClass: ExportScopeCalculator },
                { provide: DataExportMapperToken, useClass: DataExportMapper },
                { provide: ExportAttachmentManifestMapperToken, useClass: ExportAttachmentManifestMapper },
                { provide: DataExportEventsPublisherToken, useClass: NoOpExportEventsPublisher },
            ],
        }).compile();

        orchestrator = app.get<ExportOrchestrator>(ExportOrchestrator);
        dataExportRepository = app.get(getRepositoryToken(DataExportEntity, EXPORTS_MODULE_DATA_SOURCE));
        attachmentRepository = app.get(getRepositoryToken(ExportAttachmentManifestEntity, EXPORTS_MODULE_DATA_SOURCE));
        tenantRepository = app.get(getRepositoryToken(TenantEntity, EXPORTS_MODULE_DATA_SOURCE));
    });

    afterAll(async () => {
        await dropDatabase(dbOptions, DATABASE_NAME, {
            baseInterval: 1000,
            maxAttempts: 10,
        });

        await app.close();
    });

    beforeEach(async () => {
        await attachmentRepository.deleteAll();
        await dataExportRepository.deleteAll();
        await tenantRepository.deleteAll();

        await createTenant();
    });

    const createTenant = async () => {
        await tenantRepository.save({ id: TENANT_ID });
    };

    describe("start", () => {
        it("should throw when trying to create another export, while the previous one is still ongoing", async () => {
            await orchestrator.start(TENANT_ID, [SCOPE_A, SCOPE_B]);

            await expect(orchestrator.start(TENANT_ID, [])).rejects.toThrow(AnotherDataExportActiveError);
        });
    });

    describe("cancel", () => {
        it("should cancel export when requested", async () => {
            await orchestrator.start(TENANT_ID, [SCOPE_A]);
            const entry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });

            await orchestrator.cancel(TENANT_ID, entry!.id);
            const cancelledEntry = await dataExportRepository.findOneBy({ id: entry!.id });

            expect(cancelledEntry).not.toBeNull();
            expect(cancelledEntry?.cancelledAt).not.toBeNull();
        });

        it("should throw when trying to cancel non-existent export", async () => {
            const entryId = randomUUID();
            await expect(orchestrator.cancel(TENANT_ID, entryId)).rejects.toThrow(DataExportNotFoundError);
        });

        it("should throw when trying to cancel already cancelled export", async () => {
            await orchestrator.start(TENANT_ID, [SCOPE_A]);
            const entry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });
            await dataExportRepository.save({ id: entry!.id, cancelledAt: new Date() });

            await expect(orchestrator.cancel(TENANT_ID, entry!.id)).rejects.toThrow(DataExportAlreadyCancelledError);
        });

        it("should throw when trying to cancel already completed export", async () => {
            await orchestrator.start(TENANT_ID, [SCOPE_A]);
            const entry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });
            await dataExportRepository.save({ id: entry!.id, completedAt: new Date() });

            await expect(orchestrator.cancel(TENANT_ID, entry!.id)).rejects.toThrow(DataExportAlreadyCompletedError);
        });
    });

    describe("checkpoint", () => {
        it("should throw when trying to checkpoint non-existent export", async () => {
            const attachment = {
                key: "irrelevant",
                path: "irrelevant",
                scope: SCOPE_A,
                metadata: { checksum: "irrelevant", part: 1, nextPart: null },
            };
            await expect(orchestrator.checkpoint(TENANT_ID, "non-existent-uuid", attachment)).rejects.toThrow();
        });

        it("should throw when trying to checkpoint already cancelled export", async () => {
            const attachment = {
                key: "irrelevant",
                path: "irrelevant",
                scope: SCOPE_A,
                metadata: { checksum: "irrelevant", part: 1, nextPart: null },
            };

            await orchestrator.start(TENANT_ID, [SCOPE_A, SCOPE_B]);
            const entry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });
            await dataExportRepository.save({ id: entry!.id, cancelledAt: new Date() });

            await expect(orchestrator.checkpoint(TENANT_ID, entry!.id, attachment)).rejects.toThrow(DataExportAlreadyCancelledError);
        });

        it("should throw when trying to checkpoint already completed export", async () => {
            const attachment = {
                key: "irrelevant",
                path: "irrelevant",
                scope: SCOPE_A,
                metadata: { checksum: "irrelevant", part: 1, nextPart: null },
            };

            await orchestrator.start(TENANT_ID, [SCOPE_A, SCOPE_B]);
            const entry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });
            await dataExportRepository.save({ id: entry!.id, completedAt: new Date() });

            await expect(orchestrator.checkpoint(TENANT_ID, entry!.id, attachment)).rejects.toThrow(DataExportAlreadyCompletedError);
        });

        it("should not complete the export when not all scoped attachments are provided", async () => {
            const attachment = {
                key: "irrelevant",
                path: "irrelevant",
                scope: SCOPE_A,
                metadata: { checksum: "irrelevant", part: 1, nextPart: null },
            };

            await orchestrator.start(TENANT_ID, [SCOPE_A, SCOPE_B]);
            const exportEntry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });

            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment);

            const updatedExport = await dataExportRepository.findOneBy({ id: exportEntry!.id });
            expect(updatedExport).not.toBeNull();
            expect(updatedExport?.completedAt).toBeNull();
        });

        it("should not complete the export when attachments cover scope only partially", async () => {
            const attachment1 = {
                key: "irrelevant_1",
                path: "irrelevant/1",
                scope: SCOPE_A,
                metadata: { checksum: "irrelevant", part: 1, nextPart: null },
            };
            const attachment2 = {
                key: "irrelevant_2",
                path: "irrelevant/2",
                scope: PARTIAL_SCOPE_B,
                metadata: { checksum: "irrelevant", part: 1, nextPart: null },
            };

            await orchestrator.start(TENANT_ID, [SCOPE_A, SCOPE_B]);
            const exportEntry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });

            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment1);
            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment2);

            const updatedExport = await dataExportRepository.findOneBy({ id: exportEntry!.id });
            expect(updatedExport).not.toBeNull();
            expect(updatedExport?.completedAt).toBeNull();
        });

        it("should not complete the export when attachments parts are missing", async () => {
            const attachment1 = {
                key: "irrelevant_1",
                path: "irrelevant/1",
                scope: SCOPE_A,
                metadata: { checksum: "irrelevant", part: 1, nextPart: null },
            };
            const attachment2 = {
                key: "irrelevant_2a",
                path: "irrelevant/2a",
                scope: SCOPE_B,
                metadata: { checksum: "irrelevant", part: 1, nextPart: 2 },
            };

            await orchestrator.start(TENANT_ID, [SCOPE_A, SCOPE_B]);
            const exportEntry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });

            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment1);
            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment2);

            const updatedExport = await dataExportRepository.findOneBy({ id: exportEntry!.id });
            expect(updatedExport).not.toBeNull();
            expect(updatedExport?.completedAt).toBeNull();
        });

        it("should complete the export when all scoped attachments are provided", async () => {
            const attachment1 = {
                key: "irrelevant_1",
                path: "irrelevant/1",
                scope: SCOPE_A,
                metadata: { checksum: "irrelevant", part: 1, nextPart: null },
            };
            const attachment2 = {
                key: "irrelevant_2a",
                path: "irrelevant/2a",
                scope: SCOPE_B,
                metadata: { checksum: "irrelevant", part: 1, nextPart: 2 },
            };
            const attachment3 = {
                key: "irrelevant_2b",
                path: "irrelevant/2b",
                scope: SCOPE_B,
                metadata: { checksum: "irrelevant", part: 2, nextPart: null },
            };

            await orchestrator.start(TENANT_ID, [SCOPE_A, SCOPE_B]);
            const exportEntry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });

            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment1);
            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment2);
            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment3);

            const updatedExport = await dataExportRepository.findOneBy({ id: exportEntry!.id });
            const attachments = await attachmentRepository.find({ where: { dataExportId: exportEntry!.id } });

            expect(updatedExport).not.toBeNull();
            expect(updatedExport?.completedAt).not.toBeNull();
            expect(attachments).toHaveLength(3);
        });
    });
});
