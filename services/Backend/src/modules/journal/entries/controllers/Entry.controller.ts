import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";

import { CurrentUser } from "@/common/decorators/CurrentUser.decorator";
import { AuthenticationGuard } from "@/common/guards/Authentication.guard";
import { PageOptionsDto } from "@/common/pagination/dto/PageOptions.dto";
import { FindEntriesByDateRangeQueryDto } from "@/modules/journal/entries/dto/FindEntriesByDateRangeQuery.dto";
import { FindEntriesByGoalsQueryDto } from "@/modules/journal/entries/dto/FindEntriesByGoalsQuery.dto";
import { type IEntryMapper, EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { type IEntryService, EntryServiceToken } from "@/modules/journal/entries/services/interfaces/IEntry.service";
import { type User } from "@/types/User";

// TODO: Allow to get entries (and counts) by goals
@Controller("entry")
export class EntryController {
    public constructor(
        @Inject(EntryServiceToken) private readonly entryService: IEntryService,
        @Inject(EntryMapperToken) private readonly entryMapper: IEntryMapper
    ) {}

    @Get()
    @UseGuards(new AuthenticationGuard())
    public async getEntries(
        @Query() { from, to }: FindEntriesByDateRangeQueryDto,
        @Query() { goals }: FindEntriesByGoalsQueryDto,
        @Query() pageOptions: PageOptionsDto,
        @CurrentUser() user: User
    ) {
        const result = await this.entryService.findAllByFilters(user.id, { from, to, goals }, pageOptions);
        return this.entryMapper.fromModelToDtoPaginated(result);
    }
}
