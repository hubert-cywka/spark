import { Body, ConflictException, Controller, Delete, Get, Inject, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { DataExportScopeDomain } from "@/common/export/types/DataExportScopeDomain";
import { AccessGuard } from "@/common/guards/Access.guard";
import { StartDataExportDto } from "@/modules/privacy/dto/StartDataExport.dto";
import { type IExportOrchestrator, ExportOrchestratorToken } from "@/modules/privacy/services/interfaces/IExportOrchestrator";
import type { User } from "@/types/User";

// TODO: GET to return all exports (with status and attachments).

@Controller("export")
export class DataExportController {
    public constructor(@Inject(ExportOrchestratorToken) private readonly exportOrchestrator: IExportOrchestrator) {}

    // TODO: Remove after tests
    @Get()
    public async test() {
        try {
            await this.exportOrchestrator.start("75e53e76-7ca3-4fb8-84a1-614a68ddb352", [
                {
                    domain: DataExportScopeDomain.ENTRIES,
                    dateRange: {
                        from: "2025-01-01",
                        to: "2026-01-01",
                    },
                },
            ]);
        } catch (err) {
            whenError(err).is(EntityConflictError).throw(new ConflictException()).elseRethrow();
        }
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
