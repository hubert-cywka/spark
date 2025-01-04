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

import { CurrentUser } from "@/common/decorators/CurrentUser.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AuthenticationGuard } from "@/common/guards/Authentication.guard";
import { PageDto } from "@/common/pagination/dto/Page.dto";
import { PageOptionsDto } from "@/common/pagination/dto/PageOptions.dto";
import { CreateDailyRequestDto } from "@/modules/journal/daily/dto/CreateDailyRequest.dto";
import { FindDailiesByDateRangeQueryDto } from "@/modules/journal/daily/dto/FindDailiesByDateRangeQuery.dto";
import { UpdateDailyDateRequestDto } from "@/modules/journal/daily/dto/UpdateDailyDateRequest.dto";
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
        @Query() { from, to, ...rest }: FindDailiesByDateRangeQueryDto,
        @Query() pageOptions: PageOptionsDto,
        @CurrentUser() author: User
    ) {
        const result = await this.dailyService.findAllByDateRange(author, from, to, pageOptions);
        const page = this.dailyMapper.fromModelToDtoPaginated(result);
        return new PageDto(page.data, page.meta); // TODO: Do not use 'new'
    }

    @Get(":id")
    @UseGuards(new AuthenticationGuard())
    public async getDailyById(@Param(new ParseUUIDPipe()) id: string, @CurrentUser() author: User) {
        try {
            const result = await this.dailyService.findOneById(author, id);
            return this.dailyMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Post()
    @UseGuards(new AuthenticationGuard())
    public async createDaily(@Body() dto: CreateDailyRequestDto, @CurrentUser() author: User) {
        const result = await this.dailyService.create(author, dto.date);
        return this.dailyMapper.fromModelToDto(result);
    }

    @Patch(":id/date")
    @UseGuards(new AuthenticationGuard())
    public async updateDaily(@Param(new ParseUUIDPipe()) id: string, @Body() dto: UpdateDailyDateRequestDto, @CurrentUser() author: User) {
        try {
            const result = await this.dailyService.update(author, id, dto.date);
            return this.dailyMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Delete(":id")
    @UseGuards(new AuthenticationGuard())
    public async deleteDaily(@Param(new ParseUUIDPipe()) id: string, @CurrentUser() author: User) {
        try {
            await this.dailyService.deleteById(author, id);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }
}
