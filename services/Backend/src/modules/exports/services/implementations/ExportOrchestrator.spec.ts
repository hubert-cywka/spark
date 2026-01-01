import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { randomUUID } from "node:crypto";
import { Repository } from "typeorm";
import { initializeTransactionalContext } from "typeorm-transactional";

import { DatabaseModule } from "@/common/database/Database.module";
import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { DataExportScopeDomain } from "@/common/export/types/DataExportScopeDomain";
import { ExportAttachmentStage } from "@/common/export/types/ExportAttachmentStage";
import { ObjectStorageModule } from "@/common/objectStorage/ObjectStorage.module";
import { type IObjectStorage, ObjectStorageToken } from "@/common/objectStorage/services/IObjectStorage";
import { DBConnectionOptions, dropDatabase } from "@/common/utils/databaseUtils";
import { TestConfig } from "@/config/testConfiguration";
import { DataExportEntity } from "@/modules/exports/entities/DataExport.entity";
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
    let manifestsRepositor: Repository<ExportAttachmentManifestEntity>;
    let tenantRepository: Repository<TenantEntity>;
    let objectStorage: IObjectStorage;
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
                            port: configService.getOrThrow<number>("modules.exports.database.port"),
                            username: configService.getOrThrow<string>("modules.exports.database.username"),
                            password: configService.getOrThrow<string>("modules.exports.database.password"),
                            host: configService.getOrThrow<string>("modules.exports.database.host"),
                        };
                        return { ...dbOptions, synchronize: true, logging: false };
                    },
                    inject: [ConfigService],
                }),
                DatabaseModule.forFeature(EXPORTS_MODULE_DATA_SOURCE, [TenantEntity, DataExportEntity, ExportAttachmentManifestEntity]),
                ObjectStorageModule.forRootAsync({
                    useFactory: (configService: ConfigService) => ({
                        credentials: {
                            accessKeyId: configService.getOrThrow<string>("s3.accessKeyId"),
                            secretAccessKey: configService.getOrThrow<string>("s3.secretAccessKey"),
                        },
                        region: configService.getOrThrow<string>("s3.region"),
                        endpoint: configService.getOrThrow<string>("s3.endpoint"),
                    }),
                    inject: [ConfigService],
                    global: true,
                }),
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
        objectStorage = app.get<IObjectStorage>(ObjectStorageToken);
        dataExportRepository = app.get(getRepositoryToken(DataExportEntity, EXPORTS_MODULE_DATA_SOURCE));
        manifestsRepositor = app.get(getRepositoryToken(ExportAttachmentManifestEntity, EXPORTS_MODULE_DATA_SOURCE));
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
        await manifestsRepositor.deleteAll();
        await dataExportRepository.deleteAll();
        await tenantRepository.deleteAll();

        await deleteAttachments(TENANT_ID);
        await createTenant(TENANT_ID);
    });

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
            const attachment = buildAttachmentManifest({ scopes: [SCOPE_A], part: 1, nextPart: null });
            await expect(orchestrator.checkpoint(TENANT_ID, "non-existent-uuid", attachment)).rejects.toThrow();
        });

        it("should throw when trying to checkpoint already cancelled export", async () => {
            const attachment = buildAttachmentManifest({ scopes: [SCOPE_A], part: 1, nextPart: null });

            await orchestrator.start(TENANT_ID, [SCOPE_A, SCOPE_B]);
            const entry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });
            await dataExportRepository.save({ id: entry!.id, cancelledAt: new Date() });

            await expect(orchestrator.checkpoint(TENANT_ID, entry!.id, attachment)).rejects.toThrow(DataExportAlreadyCancelledError);
        });

        it("should throw when trying to checkpoint already completed export", async () => {
            const attachment = buildAttachmentManifest({ scopes: [SCOPE_A], part: 1, nextPart: null });

            await orchestrator.start(TENANT_ID, [SCOPE_A, SCOPE_B]);
            const entry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });
            await dataExportRepository.save({ id: entry!.id, completedAt: new Date() });

            await expect(orchestrator.checkpoint(TENANT_ID, entry!.id, attachment)).rejects.toThrow(DataExportAlreadyCompletedError);
        });

        it("should not complete the export when not all attachments are provided", async () => {
            const attachment = buildAttachmentManifest({ scopes: [SCOPE_A], part: 1, nextPart: null });

            await orchestrator.start(TENANT_ID, [SCOPE_A, SCOPE_B]);
            const exportEntry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });

            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment);

            await expectExportNotToBeCompleted(exportEntry?.id);
            await expectFinalAttachmentToNotExist(exportEntry?.id);
        });

        it("should not complete the export when attachments cover scope only partially", async () => {
            const attachment1 = buildAttachmentManifest({ scopes: [SCOPE_A], part: 1, nextPart: null });
            const attachment2 = buildAttachmentManifest({ scopes: [PARTIAL_SCOPE_B], part: 1, nextPart: null });

            await orchestrator.start(TENANT_ID, [SCOPE_A, SCOPE_B]);
            const exportEntry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });

            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment1);
            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment2);

            await expectExportNotToBeCompleted(exportEntry?.id);
            await expectFinalAttachmentToNotExist(exportEntry?.id);
        });

        it("should not complete the export when attachments parts are still missing", async () => {
            const attachment1 = buildAttachmentManifest({ scopes: [SCOPE_A], part: 1, nextPart: null });
            const attachment2 = buildAttachmentManifest({ scopes: [SCOPE_B], part: 1, nextPart: 2 });

            await orchestrator.start(TENANT_ID, [SCOPE_A, SCOPE_B]);
            const exportEntry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });

            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment1);
            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment2);

            await expectExportNotToBeCompleted(exportEntry?.id);
            await expectFinalAttachmentToNotExist(exportEntry?.id);
        });

        it("should complete the export when all scoped attachments are provided", async () => {
            const attachment1 = buildAttachmentManifest({ scopes: [SCOPE_A], part: 1, nextPart: null });
            const attachment2 = buildAttachmentManifest({ scopes: [SCOPE_B], part: 1, nextPart: 2 });
            const attachment3 = buildAttachmentManifest({ scopes: [SCOPE_B], part: 2, nextPart: null });

            await orchestrator.start(TENANT_ID, [SCOPE_A, SCOPE_B]);
            const exportEntry = await dataExportRepository.findOneBy({ tenantId: TENANT_ID });

            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment1);
            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment2);
            await orchestrator.checkpoint(TENANT_ID, exportEntry!.id, attachment3);

            await expectExportToBeCompleted(exportEntry?.id);
            await expectFinalAttachmentToExist(exportEntry?.id);
        });
    });

    const expectExportToBeCompleted = async (dataExportId?: string) => {
        const updatedExport = await dataExportRepository.findOneBy({ id: dataExportId });
        expect(updatedExport).not.toBeNull();
        expect(updatedExport?.completedAt).not.toBeNull();
    };

    const expectExportNotToBeCompleted = async (dataExportId?: string) => {
        const updatedExport = await dataExportRepository.findOneBy({ id: dataExportId });
        expect(updatedExport).not.toBeNull();
        expect(updatedExport?.completedAt).toBeNull();
    };

    const expectFinalAttachmentToExist = async (dataExportId?: string) => {
        const manifests = await manifestsRepositor.find({ where: { dataExportId } });
        const manifest = manifests.find((a) => a.stage === ExportAttachmentStage.FINAL);
        const exists = await objectStorage.exists(manifest!.path);

        expect(manifest).not.toBeFalsy();
        expect(exists).toBeTruthy();
    };

    const expectFinalAttachmentToNotExist = async (dataExportId?: string) => {
        const manifests = await manifestsRepositor.find({ where: { dataExportId } });
        expect(manifests.find((a) => a.stage === ExportAttachmentStage.FINAL)).toBeFalsy();
    };

    const createTenant = async (tenantId: string) => {
        await tenantRepository.save({ id: tenantId });
    };

    const deleteAttachments = async (tenantId: string) => {
        const manifests = await manifestsRepositor.find({ where: { tenantId } });
        const paths = manifests.map((manifest) => manifest.path);
        await objectStorage.delete(paths);
    };

    const buildAttachmentManifest = ({
        part,
        nextPart,
        scopes,
    }: Pick<ExportAttachmentManifest, "scopes"> & Pick<ExportAttachmentManifest["metadata"], "part" | "nextPart">) => {
        const id = scopes.map((scope) => `${scope.domain}_${scope.dateRange.from}_${scope.dateRange.to}`).join("___");

        return {
            scopes,
            key: `irrelevant_${id}_${part}`,
            path: `irrelevant/${id}/${part}`,
            stage: ExportAttachmentStage.PARTIAL,
            metadata: { checksum: "irrelevant", part, nextPart },
        };
    };
});
