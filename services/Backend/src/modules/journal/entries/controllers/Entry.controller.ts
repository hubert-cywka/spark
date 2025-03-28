import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";
import { plainToClass } from "class-transformer";

import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { Timezone } from "@/common/decorators/Timezone.decorator";
import { AuthenticationGuard } from "@/common/guards/Authentication.guard";
import { PageOptionsDto } from "@/common/pagination/dto/PageOptions.dto";
import { EntriesMetricsDto } from "@/modules/journal/entries/dto/EntriesMetrics.dto";
import { EntryLoggingHistogramDto } from "@/modules/journal/entries/dto/EntryLoggingHistogram.dto";
import { FindEntriesFiltersDto } from "@/modules/journal/entries/dto/FindEntriesFilters.dto";
import { FindEntriesInsightsDto } from "@/modules/journal/entries/dto/FindEntriesInsights.dto";
import { type IEntryMapper, EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
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
        @Inject(EntryMapperToken) private readonly entryMapper: IEntryMapper
    ) {}

    @Get()
    @UseGuards(AuthenticationGuard)
    public async getEntries(
        @Query() filters: FindEntriesFiltersDto,
        @Query() pageOptions: PageOptionsDto,
        @AuthenticatedUserContext() user: User
    ) {
        const result = await this.entryService.findAll(user.id, pageOptions, filters);
        return this.entryMapper.fromModelToDtoPage(result);
    }

    @Get("insights/metrics")
    @UseGuards(AuthenticationGuard)
    public async getEntriesMetrics(@Query() filters: FindEntriesInsightsDto, @AuthenticatedUserContext() user: User) {
        const result = await this.insightsService.findMetricsByDateRange(user.id, filters.from, filters.to);
        return plainToClass(EntriesMetricsDto, {
            ...result,
            dailyRange: { to: filters.to, from: filters.from },
        });
    }

    @Get("insights/logging-histogram")
    @UseGuards(AuthenticationGuard)
    public async getEntryLoggingHistogram(
        @Query() filters: FindEntriesInsightsDto,
        @AuthenticatedUserContext() user: User,
        @Timezone() timezone: string
    ) {
        const result = await this.insightsService.findLoggingHistogram(user.id, filters.from, filters.to, timezone);
        return plainToClass(EntryLoggingHistogramDto, {
            days: result,
            dailyRange: { to: filters.to, from: filters.from },
        });
    }
}
