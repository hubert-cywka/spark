import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    Inject,
    NotFoundException,
    Param,
    Post,
    Query,
    Res,
    UseGuards,
} from "@nestjs/common";
import type { FastifyReply } from "fastify";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AccessGuard } from "@/common/guards/Access.guard";
import { type IObjectStorage, ObjectStorageToken } from "@/common/objectStorage/services/IObjectStorage";
import { PageOptionsDto } from "@/common/pagination/dto/PageOptions.dto";
import { StartDataExportDto } from "@/modules/exports/dto/StartDataExport.dto";
import { type IDataExportMapper, DataExportMapperToken } from "@/modules/exports/mappers/IDataExport.mapper";
import { type IDataExportService, DataExportServiceToken } from "@/modules/exports/services/interfaces/IDataExportService";
import {
    type IExportAttachmentManifestService,
    ExportAttachmentManifestServiceToken,
} from "@/modules/exports/services/interfaces/IExportAttachmentManifestService";
import { type IExportOrchestrator, ExportOrchestratorToken } from "@/modules/exports/services/interfaces/IExportOrchestrator";
import type { User } from "@/types/User";

@Controller("export")
export class DataExportController {
    public constructor(
        @Inject(ExportOrchestratorToken) private readonly exportOrchestrator: IExportOrchestrator,
        @Inject(DataExportServiceToken) private readonly exportService: IDataExportService,
        @Inject(ExportAttachmentManifestServiceToken) private readonly manifestService: IExportAttachmentManifestService,
        @Inject(DataExportMapperToken) private readonly mapper: IDataExportMapper,
        @Inject(ObjectStorageToken) private readonly objectStorage: IObjectStorage
    ) {}

    @Get(":exportId/files")
    @UseGuards(AccessGuard)
    async download(@Param("exportId") exportId: string, @Res() response: FastifyReply, @AuthenticatedUserContext() tenant: User) {
        try {
            const manifest = await this.manifestService.getFinalManifestByExportId(tenant.id, exportId);
            const stream = await this.objectStorage.download(manifest.path);

            response.header("Content-Type", "application/zip");
            response.header("Content-Disposition", `attachment; filename="export-${exportId}.zip"`);
            return response.send(stream);
        } catch (err) {
            whenError(err)
                .is(EntityNotFoundError)
                .throw(new NotFoundException())
                .is(EntityConflictError)
                .throw(new ConflictException())
                .elseRethrow();
        }
    }

    @Get()
    @UseGuards(AccessGuard)
    public async getAll(@Query() pageOptions: PageOptionsDto, @AuthenticatedUserContext() tenant: User) {
        const exports = await this.exportService.findAllValid(tenant.id, pageOptions);
        return this.mapper.fromModelToDtoPage(exports);
    }

    @Post()
    @UseGuards(AccessGuard)
    @AccessScopes("write:account")
    public async startExport(@AuthenticatedUserContext() tenant: User, @Body() dto: StartDataExportDto) {
        try {
            await this.exportOrchestrator.start(tenant.id, dto.targetScopes);
        } catch (err) {
            whenError(err).is(EntityConflictError).throw(new ConflictException()).elseRethrow();
        }
    }

    @Delete(":exportId")
    @UseGuards(AccessGuard)
    @AccessScopes("write:account")
    public async cancelExport(@Param("exportId") exportId: string, @AuthenticatedUserContext() tenant: User) {
        try {
            await this.exportOrchestrator.cancel(tenant.id, exportId);
        } catch (err) {
            whenError(err)
                .is(EntityNotFoundError)
                .throw(new NotFoundException())
                .is(EntityConflictError)
                .throw(new ConflictException())
                .elseRethrow();
        }
    }
}
