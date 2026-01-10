import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { plainToInstance } from "class-transformer";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { Timezone } from "@/common/decorators/Timezone.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AccessGuard } from "@/common/guards/Access.guard";
import { PageOptionsDto } from "@/common/pagination/dto/PageOptions.dto";
import { BulkDeleteEntryDto } from "@/modules/journal/entries/dto/BulkDeleteEntry.dto";
import { BulkUpdateEntryDto } from "@/modules/journal/entries/dto/BulkUpdateEntry.dto";
import { CreateEntryDto } from "@/modules/journal/entries/dto/CreateEntry.dto";
import { EntriesMetricsDto } from "@/modules/journal/entries/dto/EntriesMetrics.dto";
import { EntryLoggingHistogramDto } from "@/modules/journal/entries/dto/EntryLoggingHistogram.dto";
import { FindEntriesFiltersDto } from "@/modules/journal/entries/dto/FindEntriesFilters.dto";
import { FindEntriesInsightsDto } from "@/modules/journal/entries/dto/FindEntriesInsights.dto";
import { UpdateEntryDto } from "@/modules/journal/entries/dto/UpdateEntry.dto";
import { type IEntryMapper, EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
import {
    type IEntriesInsightsProvider,
    EntriesInsightsProviderToken,
} from "@/modules/journal/entries/services/interfaces/IEntriesInsightsProvider";
import { type IEntryService, EntryServiceToken } from "@/modules/journal/entries/services/interfaces/IEntryService";
import { type User } from "@/types/User";

@Controller("entry")
export class EntryController {
    public constructor(
        @Inject(EntryServiceToken) private readonly entryService: IEntryService,
        @Inject(EntriesInsightsProviderToken)
        private readonly insightsService: IEntriesInsightsProvider,
        @Inject(EntryMapperToken) private readonly entryMapper: IEntryMapper
    ) {}

    @Get()
    @UseGuards(AccessGuard)
    @AccessScopes("read:entry")
    public async getEntries(
        @Query() filters: FindEntriesFiltersDto,
        @Query() pageOptions: PageOptionsDto,
        @AuthenticatedUserContext() user: User
    ) {
        const result = await this.entryService.findAll(user.id, pageOptions, filters);
        return this.entryMapper.fromModelToDtoPage(result);
    }

    @Post()
    @UseGuards(AccessGuard)
    @AccessScopes("write:entry")
    public async createEntry(@AuthenticatedUserContext() user: User, @Body() dto: CreateEntryDto) {
        try {
            const result = await this.entryService.create(user.id, {
                date: dto.date,
                content: dto.content,
                isFeatured: dto.isFeatured ?? false,
                isCompleted: dto.isCompleted ?? false,
            });
            return this.entryMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException());
        }
    }

    @Patch()
    @UseGuards(AccessGuard)
    @AccessScopes("write:entry")
    public async bulkUpdateEntries(@AuthenticatedUserContext() user: User, @Body() dto: BulkUpdateEntryDto) {
        const result = await this.entryService.bulkUpdate(user.id, dto.ids, dto.value);
        return this.entryMapper.fromModelToDtoBulk(result);
    }

    @Patch(":entryId")
    @UseGuards(AccessGuard)
    @AccessScopes("write:entry")
    public async updateEntry(@Param("entryId") entryId: string, @AuthenticatedUserContext() user: User, @Body() dto: UpdateEntryDto) {
        try {
            const result = await this.entryService.update(user.id, entryId, dto);
            return this.entryMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException());
        }
    }

    @Post("delete-requests")
    @UseGuards(AccessGuard)
    @AccessScopes("write:entry")
    public async bulkDeleteEntries(@AuthenticatedUserContext() user: User, @Body() dto: BulkDeleteEntryDto) {
        await this.entryService.bulkDelete(user.id, dto.ids);
    }

    @Delete(":entryId")
    @UseGuards(AccessGuard)
    @AccessScopes("delete:entry")
    public async removeEntry(@Param("entryId") entryId: string, @AuthenticatedUserContext() user: User) {
        try {
            await this.entryService.deleteById(user.id, entryId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException());
        }
    }

    @Post(":entryId/restore")
    @UseGuards(AccessGuard)
    @AccessScopes("write:entry")
    public async restoreEntry(@Param("entryId") entryId: string, @AuthenticatedUserContext() user: User) {
        try {
            await this.entryService.restoreById(user.id, entryId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException());
        }
    }

    @Get("insights/metrics")
    @UseGuards(AccessGuard)
    @AccessScopes("read:entry")
    public async getEntriesMetrics(@Query() filters: FindEntriesInsightsDto, @AuthenticatedUserContext() user: User) {
        const result = await this.insightsService.getMetricsByDateRange(user.id, filters.from, filters.to);
        return plainToInstance(EntriesMetricsDto, {
            ...result,
            dailyRange: { to: filters.to, from: filters.from },
        });
    }

    @Get("insights/logging-histogram")
    @UseGuards(AccessGuard)
    @AccessScopes("read:entry")
    public async getEntryLoggingHistogram(
        @Query() filters: FindEntriesInsightsDto,
        @AuthenticatedUserContext() user: User,
        @Timezone() timezone: string
    ) {
        const result = await this.insightsService.getLoggingHistogram(user.id, filters.from, filters.to, timezone);
        return plainToInstance(EntryLoggingHistogramDto, {
            days: result,
            dailyRange: { to: filters.to, from: filters.from },
        });
    }
}
