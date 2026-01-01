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
import { DataExportPathBuilder } from "@/common/export/services/DataExportPathBuilder";
import { AccessGuard } from "@/common/guards/Access.guard";
import { PageOptionsDto } from "@/common/pagination/dto/PageOptions.dto";
import { type IObjectStorage, ObjectStorageToken } from "@/common/s3/services/IObjectStorage";
import { StartDataExportDto } from "@/modules/privacy/dto/StartDataExport.dto";
import { type IDataExportMapper, DataExportMapperToken } from "@/modules/privacy/mappers/IDataExport.mapper";
import { type IDataExportService, DataExportServiceToken } from "@/modules/privacy/services/interfaces/IDataExportService";
import { type IExportOrchestrator, ExportOrchestratorToken } from "@/modules/privacy/services/interfaces/IExportOrchestrator";
import type { User } from "@/types/User";

@Controller("export")
export class DataExportController {
    public constructor(
        @Inject(ExportOrchestratorToken) private readonly exportOrchestrator: IExportOrchestrator,
        @Inject(DataExportServiceToken) private readonly service: IDataExportService,
        @Inject(DataExportMapperToken) private readonly mapper: IDataExportMapper,
        @Inject(ObjectStorageToken) private readonly objectStorage: IObjectStorage
    ) {}

    @Get(":exportId/files")
    @UseGuards(AccessGuard)
    // TODO: Download zip directly
    async download(@Param("exportId") exportId: string, @Res() response: FastifyReply, @AuthenticatedUserContext() tenant: User) {
        try {
            const dataExport = await this.service.getCompletedById(tenant.id, exportId);

            // TODO: Get destination path from manifest
            const destinationPath = DataExportPathBuilder.forExport(exportId).setFilename("final.zip").build();
            const stream = await this.objectStorage.download(destinationPath);

            response.header("Content-Type", "application/zip");
            response.header("Content-Disposition", `attachment; filename="export-${dataExport.id}.zip"`);
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
        const exports = await this.service.findAll(tenant.id, pageOptions);
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
