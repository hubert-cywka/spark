import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";

import { CurrentUser } from "@/common/decorators/CurrentUser.decorator";
import { UUIDDto } from "@/common/dto/UUID.dto";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AuthenticationGuard } from "@/common/guards/Authentication.guard";
import { TransformToDtoInterceptor } from "@/common/interceptors/TransformToDto.interceptor";
import { CreateDailyRequestDto } from "@/modules/journal/daily/dto/CreateDailyRequest.dto";
import { DailyDto } from "@/modules/journal/daily/dto/Daily.dto";
import { FindDailiesByDateRangeQueryDto } from "@/modules/journal/daily/dto/FindDailiesByDateRangeQuery.dto";
import { UpdateDailyDateRequestDto } from "@/modules/journal/daily/dto/UpdateDailyDateRequest.dto";
import { type IDailyService, DailyServiceToken } from "@/modules/journal/daily/services/interfaces/IDaily.service";
import { type User } from "@/types/User";

@Controller("daily")
export class DailyController {
    public constructor(@Inject(DailyServiceToken) public readonly dailyService: IDailyService) {}

    @Get()
    @UseGuards(new AuthenticationGuard())
    @UseInterceptors(new TransformToDtoInterceptor(DailyDto))
    public async getDailies(@Query() { from, to }: FindDailiesByDateRangeQueryDto, @CurrentUser() author: User) {
        return await this.dailyService.findAllByDateRange(author, new Date(from), new Date(to));
    }

    @Get(":id")
    @UseGuards(new AuthenticationGuard())
    @UseInterceptors(new TransformToDtoInterceptor(DailyDto))
    public async getDailyById(@Param() { id }: UUIDDto, @CurrentUser() author: User) {
        try {
            return await this.dailyService.findOneById(author, id);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    // TODO: Validation
    @Post()
    @UseGuards(new AuthenticationGuard())
    public async createDaily(@Body() dto: CreateDailyRequestDto, @CurrentUser() author: User) {
        try {
            return await this.dailyService.create(author, new Date(dto.date));
        } catch (err) {
            // TODO: Error handling
            whenError(err).elseRethrow();
        }
    }

    // TODO: Validation
    @Patch(":id/date")
    @UseGuards(new AuthenticationGuard())
    public async updateDaily(@Param() { id }: UUIDDto, @Body() dto: UpdateDailyDateRequestDto, @CurrentUser() author: User) {
        try {
            return await this.dailyService.update(author, id, new Date(dto.date));
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Delete(":id")
    @UseGuards(new AuthenticationGuard())
    public async deleteDaily(@Param() { id }: UUIDDto, @CurrentUser() author: User) {
        try {
            return await this.dailyService.deleteById(author, id);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }
}
