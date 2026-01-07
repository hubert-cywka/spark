import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import dayjs from "dayjs";
import { IsNull, LessThanOrEqual, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { type IDatabaseLockService, DatabaseLockServiceToken } from "@/common/database/services/IDatabaseLockService";
import { DataExportScope } from "@/common/export/models/DataExportScope";
import { applyCursorBasedPagination, createPage, createPaginationKeys } from "@/common/pagination/pagination";
import { PageOptions } from "@/common/pagination/types/PageOptions";
import { DataExportEntity } from "@/modules/exports/entities/DataExport.entity";
import { AnotherDataExportActiveError } from "@/modules/exports/errors/AnotherDataExportActiveError";
import { DataExportAlreadyCancelledError } from "@/modules/exports/errors/DataExportAlreadyCancelled.error";
import { DataExportAlreadyCompletedError } from "@/modules/exports/errors/DataExportAlreadyCompleted.error";
import { DataExportNotCompletedError } from "@/modules/exports/errors/DataExportNotCompleted.error";
import { DataExportNotFoundError } from "@/modules/exports/errors/DataExportNotFound.error";
import { EXPORTS_MODULE_DATA_SOURCE } from "@/modules/exports/infrastructure/database/constants";
import { type IDataExportMapper, DataExportMapperToken } from "@/modules/exports/mappers/IDataExport.mapper";
import { DataExport } from "@/modules/exports/models/DataExport.model";
import { type IDataExportService } from "@/modules/exports/services/interfaces/IDataExportService";
import { type IExportScopeCalculator, ExportScopeCalculatorToken } from "@/modules/exports/services/interfaces/IExportScopeCalculator";

@Injectable()
export class DataExportService implements IDataExportService {
    private readonly logger = new Logger(DataExportService.name);

    public constructor(
        @InjectRepository(DataExportEntity, EXPORTS_MODULE_DATA_SOURCE)
        private readonly repository: Repository<DataExportEntity>,
        @Inject(DataExportMapperToken)
        private readonly mapper: IDataExportMapper,
        @Inject(DatabaseLockServiceToken)
        private readonly dbLockService: IDatabaseLockService,
        @Inject(ExportScopeCalculatorToken)
        private readonly scopeCalculator: IExportScopeCalculator,
        @Inject(ConfigService)
        private readonly configService: ConfigService
    ) {}

    public async findAllValid(tenantId: string, pageOptions: PageOptions) {
        const queryBuilder = this.getRepository()
            .createQueryBuilder("export")
            .where("export.tenantId = :tenantId", { tenantId })
            .andWhere("export.validUntil > :now", { now: new Date() });

        const paginationKeys = createPaginationKeys(["startedAt", "id"]);
        applyCursorBasedPagination(queryBuilder, pageOptions, paginationKeys);

        const dataExports = await queryBuilder.getMany();
        const mappedExports = this.mapper.fromEntityToModelBulk(dataExports);
        return createPage(mappedExports, pageOptions.take, paginationKeys);
    }

    // We could simply add a more specific WHERE clause, but in this case it's important to differentiate between a
    // scenario where the export does not exist at all and where it's completed/canceled already.
    public async getActiveById(tenantId: string, exportId: string) {
        const dataExport = await this.getAnyById(tenantId, exportId);
        this.assertExportIsActive(tenantId, dataExport);
        return dataExport;
    }

    public async getCompletedById(tenantId: string, exportId: string) {
        const dataExport = await this.getAnyById(tenantId, exportId);
        this.assertExportIsCompleted(tenantId, dataExport);
        return dataExport;
    }

    @Transactional({ connectionName: EXPORTS_MODULE_DATA_SOURCE })
    public async createExportEntry(tenantId: string, targetScopes: DataExportScope[]) {
        const ttl = this.configService.getOrThrow<number>("modules.exports.expiration.ttlInDays");
        const validUntil = dayjs().add(ttl, "day").toDate();

        const now = new Date();
        const mergedScopes = this.scopeCalculator.mergeScopes(targetScopes);
        const trimmedScopes = this.scopeCalculator.trimScopesAfter(mergedScopes, now);

        await this.acquireLockForCreate(tenantId);
        await this.assertCanCreateExportEntry(tenantId);

        const result = await this.getRepository()
            .createQueryBuilder()
            .insert()
            .into(DataExportEntity)
            .values({
                tenantId,
                targetScopes: trimmedScopes,
                validUntil,
            })
            .returning("*")
            .execute();

        const dataExport = result.raw[0] as DataExportEntity;
        return this.mapper.fromEntityToModel(dataExport);
    }

    public async markExportAsCancelled(tenantId: string, exportId: string) {
        const dataExport = await this.getAnyById(tenantId, exportId);
        this.assertExportIsActive(tenantId, dataExport);
        await this.getRepository().update({ id: exportId }, { cancelledAt: new Date() });
    }

    public async markExportAsCompleted(tenantId: string, exportId: string) {
        const dataExport = await this.getAnyById(tenantId, exportId);
        this.assertExportIsActive(tenantId, dataExport);
        await this.getRepository().update({ id: exportId }, { completedAt: new Date() });
    }

    // We don't have to remove attachments manually. There is a TTL configured for the whole bucket, so every file
    // will be deleted eventually.
    public async deleteExpired() {
        await this.getRepository().delete({
            validUntil: LessThanOrEqual(new Date()),
        });

        this.logger.log("Expired exports deleted.");
    }

    private async getAnyById(tenantId: string, exportId: string) {
        const dataExport = await this.getRepository().findOne({ where: { tenantId, id: exportId } });

        if (!dataExport) {
            this.logger.warn({ tenantId, exportId }, "Export not found");
            throw new DataExportNotFoundError();
        }

        return this.mapper.fromEntityToModel(dataExport);
    }

    private async getActive(tenantId: string) {
        const dataExport = await this.getRepository().findOne({ where: { tenantId, cancelledAt: IsNull(), completedAt: IsNull() } });

        if (!dataExport) {
            return null;
        }

        return this.mapper.fromEntityToModel(dataExport);
    }

    private async assertCanCreateExportEntry(tenantId: string) {
        const activeExport = await this.getActive(tenantId);

        if (activeExport) {
            this.logger.warn({ tenantId }, "Another export is already in progress.");
            throw new AnotherDataExportActiveError();
        }

        return activeExport;
    }

    private async acquireLockForCreate(tenantId: string) {
        const lockId = `create-export-lock-${tenantId}`;
        await this.dbLockService.acquireTransactionLock(lockId);
    }

    private assertExportIsActive(tenantId: string, dataExport: DataExport) {
        if (dataExport.cancelledAt) {
            this.logger.warn({ tenantId, exportId: dataExport.id }, "Export already cancelled.");
            throw new DataExportAlreadyCancelledError();
        }

        if (dataExport.completedAt) {
            this.logger.warn({ tenantId, exportId: dataExport.id }, "Export already completed.");
            throw new DataExportAlreadyCompletedError();
        }
    }

    private assertExportIsCompleted(tenantId: string, dataExport: DataExport) {
        if (!dataExport.completedAt) {
            this.logger.warn({ tenantId, exportId: dataExport.id }, "Export not completed yet.");
            throw new DataExportNotCompletedError();
        }
    }

    private getRepository(): Repository<DataExportEntity> {
        return this.repository;
    }
}
