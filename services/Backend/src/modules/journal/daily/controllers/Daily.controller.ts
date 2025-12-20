import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { Timezone } from "@/common/decorators/Timezone.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AccessGuard } from "@/common/guards/Access.guard";
import { PageOptionsDto } from "@/common/pagination/dto/PageOptions.dto";
import { CreateDailyDto } from "@/modules/journal/daily/dto/CreateDaily.dto";
import { DailyMetricsDto } from "@/modules/journal/daily/dto/DailyMetrics.dto";
import { FindDailyFiltersDto } from "@/modules/journal/daily/dto/FindDailyFilters.dto";
import { FindDailyMetricsDto } from "@/modules/journal/daily/dto/FindDailyMetrics.dto";
import { UpdateDailyDateDto } from "@/modules/journal/daily/dto/UpdateDailyDate.dto";
import { type IDailyMapper, DailyMapperToken } from "@/modules/journal/daily/mappers/IDaily.mapper";
import { type IDailyService, DailyServiceToken } from "@/modules/journal/daily/services/interfaces/IDaily.service";
import {
    type IDailyInsightsProvider,
    DailyInsightsProviderToken,
} from "@/modules/journal/daily/services/interfaces/IDailyInsightsProvider.service";
import { type IDailyProviderService, DailyProviderServiceToken } from "@/modules/journal/daily/services/interfaces/IDailyProvider.service";
import { type User } from "@/types/User";

@Controller("daily")
export class DailyController {
    public constructor(
        @Inject(DailyServiceToken) private readonly dailyService: IDailyService,
        @Inject(DailyProviderServiceToken) private readonly dailyProvider: IDailyProviderService,
        @Inject(DailyInsightsProviderToken)
        private readonly insightsService: IDailyInsightsProvider,
        @Inject(DailyMapperToken) private readonly dailyMapper: IDailyMapper
    ) {}

    @Get()
    @UseGuards(AccessGuard)
    @AccessScopes("read:daily")
    public async getDailies(
        @Query() { from, to }: FindDailyFiltersDto,
        @Query() pageOptions: PageOptionsDto,
        @AuthenticatedUserContext() author: User
    ) {
        const result = await this.dailyProvider.findAllByDateRange(author.id, from, to, pageOptions);
        return this.dailyMapper.fromModelToDtoPage(result);
    }

    @Get("metrics")
    @UseGuards(AccessGuard)
    @AccessScopes("read:daily")
    public async getDailyActivity(
        @Query() { from, to }: FindDailyMetricsDto,
        @AuthenticatedUserContext() author: User,
        @Timezone() timezone: string
    ) {
        const result = await this.insightsService.findMetricsByDateRange(author.id, { from, to }, timezone);
        return plainToInstance(DailyMetricsDto, result);
    }

    @Get(":id")
    @UseGuards(AccessGuard)
    @AccessScopes("read:daily")
    public async getDailyById(@Param("id", new ParseUUIDPipe()) dailyId: string, @AuthenticatedUserContext() author: User) {
        try {
            const result = await this.dailyProvider.findOneById(author.id, dailyId);
            return this.dailyMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Post()
    @UseGuards(AccessGuard)
    @AccessScopes("write:daily")
    public async createDaily(@Body() dto: CreateDailyDto, @AuthenticatedUserContext() author: User) {
        const result = await this.dailyService.create(author.id, dto.date);
        return this.dailyMapper.fromModelToDto(result);
    }

    @Patch(":id/date")
    @UseGuards(AccessGuard)
    @AccessScopes("write:daily")
    public async updateDaily(
        @Param("id", new ParseUUIDPipe()) dailyId: string,
        @Body() dto: UpdateDailyDateDto,
        @AuthenticatedUserContext() author: User
    ) {
        try {
            const result = await this.dailyService.update(author.id, dailyId, dto.date);
            return this.dailyMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Delete(":id")
    @UseGuards(AccessGuard)
    @AccessScopes("delete:daily")
    public async deleteDaily(@Param("id", new ParseUUIDPipe()) dailyId: string, @AuthenticatedUserContext() author: User) {
        try {
            await this.dailyService.deleteById(author.id, dailyId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Post(":id/restore")
    @UseGuards(AccessGuard)
    @AccessScopes("write:daily")
    public async restoreDaily(@Param("id", new ParseUUIDPipe()) dailyId: string, @AuthenticatedUserContext() author: User) {
        try {
            await this.dailyService.restoreById(author.id, dailyId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }
}
