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

import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AuthenticationGuard } from "@/common/guards/Authentication.guard";
import { PageOptionsDto } from "@/common/pagination/dto/PageOptions.dto";
import { CreateDailyDto } from "@/modules/journal/daily/dto/CreateDaily.dto";
import { FindDailyFiltersDto } from "@/modules/journal/daily/dto/FindDailyFilters.dto";
import { UpdateDailyDateDto } from "@/modules/journal/daily/dto/UpdateDailyDate.dto";
import { type IDailyMapper, DailyMapperToken } from "@/modules/journal/daily/mappers/IDaily.mapper";
import { type IDailyService, DailyServiceToken } from "@/modules/journal/daily/services/interfaces/IDaily.service";
import { type User } from "@/types/User";

@Controller("daily")
export class DailyController {
    public constructor(
        @Inject(DailyServiceToken) private readonly dailyService: IDailyService,
        @Inject(DailyMapperToken) private readonly dailyMapper: IDailyMapper
    ) {}

    @Get()
    @UseGuards(new AuthenticationGuard())
    public async getDailies(
        @Query() { from, to }: FindDailyFiltersDto,
        @Query() pageOptions: PageOptionsDto,
        @AuthenticatedUserContext() author: User
    ) {
        const result = await this.dailyService.findAllByDateRange(author.id, from, to, pageOptions);
        return this.dailyMapper.fromModelToDtoPage(result);
    }

    @Get(":id")
    @UseGuards(new AuthenticationGuard())
    public async getDailyById(@Param("id", new ParseUUIDPipe()) dailyId: string, @AuthenticatedUserContext() author: User) {
        try {
            const result = await this.dailyService.findOneById(author.id, dailyId);
            return this.dailyMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Post()
    @UseGuards(new AuthenticationGuard())
    public async createDaily(@Body() dto: CreateDailyDto, @AuthenticatedUserContext() author: User) {
        const result = await this.dailyService.create(author.id, dto.date);
        return this.dailyMapper.fromModelToDto(result);
    }

    @Patch(":id/date")
    @UseGuards(new AuthenticationGuard())
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
    @UseGuards(new AuthenticationGuard())
    public async deleteDaily(@Param("id", new ParseUUIDPipe()) dailyId: string, @AuthenticatedUserContext() author: User) {
        try {
            await this.dailyService.deleteById(author.id, dailyId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Post(":id/restore")
    @UseGuards(new AuthenticationGuard())
    public async restoreDaily(@Param("id", new ParseUUIDPipe()) dailyId: string, @AuthenticatedUserContext() author: User) {
        try {
            await this.dailyService.restoreById(author.id, dailyId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }
}
