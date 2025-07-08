import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";
import { plainToInstance } from "class-transformer";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { Timezone } from "@/common/decorators/Timezone.decorator";
import { AccessGuard } from "@/common/guards/Access.guard";
import { PageOptionsDto } from "@/common/pagination/dto/PageOptions.dto";
import { EntriesMetricsDto } from "@/modules/journal/entries/dto/EntriesMetrics.dto";
import { EntryLoggingHistogramDto } from "@/modules/journal/entries/dto/EntryLoggingHistogram.dto";
import { FindEntriesFiltersDto } from "@/modules/journal/entries/dto/FindEntriesFilters.dto";
import { FindEntriesInsightsDto } from "@/modules/journal/entries/dto/FindEntriesInsights.dto";
import { FindEntryDetailsFiltersDto } from "@/modules/journal/entries/dto/FindEntryDetailsFilters.dto";
import { type IEntryMapper, EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { type IEntryDetailMapper, EntryDetailMapperToken } from "@/modules/journal/entries/mappers/IEntryDetail.mapper";
import {
    type IEntriesInsightsService,
    EntriesInsightsServiceToken,
} from "@/modules/journal/entries/services/interfaces/IEntriesInsights.service";
import { type IEntryService, EntryServiceToken } from "@/modules/journal/entries/services/interfaces/IEntry.service";
import { type User } from "@/types/User";

@Controller("entry")
export class EntryController {
    public constructor(
        @Inject(EntryServiceToken) private readonly entryService: IEntryService,
        @Inject(EntriesInsightsServiceToken)
        private readonly insightsService: IEntriesInsightsService,
        @Inject(EntryMapperToken) private readonly entryMapper: IEntryMapper,
        @Inject(EntryDetailMapperToken)
        private readonly entryDetailMapper: IEntryDetailMapper
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

    @Get("/details")
    @UseGuards(AccessGuard)
    @AccessScopes("read:entry")
    public async getEntriesDetailed(
        @Query() filters: FindEntryDetailsFiltersDto,
        @Query() pageOptions: PageOptionsDto,
        @AuthenticatedUserContext() user: User
    ) {
        const result = await this.entryService.findAllDetailed(user.id, pageOptions, filters);
        return this.entryDetailMapper.fromModelToDtoPage(result);
    }

    @Get("insights/metrics")
    @UseGuards(AccessGuard)
    @AccessScopes("read:entry")
    public async getEntriesMetrics(@Query() filters: FindEntriesInsightsDto, @AuthenticatedUserContext() user: User) {
        const result = await this.insightsService.findMetricsByDateRange(user.id, filters.from, filters.to);
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
        const result = await this.insightsService.findLoggingHistogram(user.id, filters.from, filters.to, timezone);
        return plainToInstance(EntryLoggingHistogramDto, {
            days: result,
            dailyRange: { to: filters.to, from: filters.from },
        });
    }
}
