import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";
import { plainToClass } from "class-transformer";

import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { AuthenticationGuard } from "@/common/guards/Authentication.guard";
import { PageOptionsDto } from "@/common/pagination/dto/PageOptions.dto";
import { EntriesInsightsDto } from "@/modules/journal/entries/dto/EntriesInsights.dto";
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
    @UseGuards(new AuthenticationGuard())
    public async getEntries(
        @Query() filters: FindEntriesFiltersDto,
        @Query() pageOptions: PageOptionsDto,
        @AuthenticatedUserContext() user: User
    ) {
        const result = await this.entryService.findAll(user.id, pageOptions, filters);
        return this.entryMapper.fromModelToDtoPage(result);
    }

    @Get("insights")
    @UseGuards(new AuthenticationGuard())
    public async getEntriesInsights(@Query() filters: FindEntriesInsightsDto, @AuthenticatedUserContext() user: User) {
        const result = await this.insightsService.findByDateRange(user.id, filters.from, filters.to);
        return plainToClass(EntriesInsightsDto, result);
    }
}
