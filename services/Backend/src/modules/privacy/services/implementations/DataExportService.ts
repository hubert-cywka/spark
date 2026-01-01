import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { type IDatabaseLockService, DatabaseLockServiceToken } from "@/common/database/services/IDatabaseLockService";
import { DataExportScope } from "@/common/export/models/DataExportScope";
import { applyCursorBasedPagination, createPage, createPaginationKeys } from "@/common/pagination/pagination";
import { PageOptions } from "@/common/pagination/types/PageOptions";
import { formatToISODateString } from "@/common/utils/dateUtils";
import { DataExportEntity } from "@/modules/privacy/entities/DataExport.entity";
import { AnotherDataExportActiveError } from "@/modules/privacy/errors/AnotherDataExportActiveError";
import { DataExportAlreadyCancelledError } from "@/modules/privacy/errors/DataExportAlreadyCancelled.error";
import { DataExportAlreadyCompletedError } from "@/modules/privacy/errors/DataExportAlreadyCompleted.error";
import { DataExportNotCompletedError } from "@/modules/privacy/errors/DataExportNotCompleted.error";
import { DataExportNotFoundError } from "@/modules/privacy/errors/DataExportNotFound.error";
import { PRIVACY_MODULE_DATA_SOURCE } from "@/modules/privacy/infrastructure/database/constants";
import { type IDataExportMapper, DataExportMapperToken } from "@/modules/privacy/mappers/IDataExport.mapper";
import { DataExport } from "@/modules/privacy/models/DataExport.model";
import { type IDataExportService } from "@/modules/privacy/services/interfaces/IDataExportService";
import { type IExportScopeCalculator, ExportScopeCalculatorToken } from "@/modules/privacy/services/interfaces/IExportScopeCalculator";

@Injectable()
export class DataExportService implements IDataExportService {
    private readonly logger = new Logger(DataExportService.name);

    public constructor(
        @InjectRepository(DataExportEntity, PRIVACY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<DataExportEntity>,
        @Inject(DataExportMapperToken)
        private readonly mapper: IDataExportMapper,
        @Inject(DatabaseLockServiceToken)
        private readonly dbLockService: IDatabaseLockService,
        @Inject(ExportScopeCalculatorToken)
        private readonly scopeCalculator: IExportScopeCalculator
    ) {}

    public async findAll(tenantId: string, pageOptions: PageOptions) {
        const queryBuilder = this.getRepository().createQueryBuilder("export").where("export.tenantId = :tenantId", { tenantId });

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

    @Transactional({ connectionName: PRIVACY_MODULE_DATA_SOURCE })
    public async createExportEntry(tenantId: string, targetScopes: DataExportScope[]) {
        const today = formatToISODateString(new Date());
        const mergedScopes = this.scopeCalculator.mergeScopes(targetScopes);
        const trimmedScopes = this.scopeCalculator.trimScopesAfter(mergedScopes, today);

        await this.acquireLockForCreate(tenantId);
        await this.assertCanCreateExportEntry(tenantId);

        const result = await this.getRepository()
            .createQueryBuilder()
            .insert()
            .into(DataExportEntity)
            .values({
                tenantId,
                targetScopes: trimmedScopes,
            })
            .returning("*")
            .execute();

        const dataExport = result.raw[0] as DataExportEntity;
        return this.mapper.fromEntityToModel(dataExport);
    }

    public async markExportAsCancelled(tenantId: string, exportId: string) {
        await this.getActiveById(tenantId, exportId);
        await this.getRepository().save({ id: exportId, cancelledAt: new Date() });
    }

    public async markExportAsCompleted(tenantId: string, exportId: string) {
        await this.getActiveById(tenantId, exportId);
        await this.getRepository().save({ id: exportId, completedAt: new Date() });
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
            this.logger.warn({ tenantId, exportId: dataExport.id }, "Export already cancelled, cannot complete.");
            throw new DataExportAlreadyCancelledError();
        }

        if (dataExport.completedAt) {
            this.logger.warn({ tenantId, exportId: dataExport.id }, "Export already completed, cannot complete.");
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
