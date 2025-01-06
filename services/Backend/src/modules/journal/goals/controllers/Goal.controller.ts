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
import { PageOptionsDto } from "@/common/pagination/dto/PageOptions.dto";
import { CreateGoalDto } from "@/modules/journal/goals/dto/CreateGoal.dto";
import { UpdateGoalsDeadlineDto } from "@/modules/journal/goals/dto/UpdateGoalsDeadline.dto";
import { UpdateGoalsNameDto } from "@/modules/journal/goals/dto/UpdateGoalsName.dto";
import { type IGoalMapper, GoalMapperToken } from "@/modules/journal/goals/mappers/IGoal.mapper";
import { type IGoalService, GoalServiceToken } from "@/modules/journal/goals/services/interfaces/IGoal.service";
import { type User } from "@/types/User";

@Controller("goal")
export class GoalController {
    public constructor(
        @Inject(GoalServiceToken) private readonly goalService: IGoalService,
        @Inject(GoalMapperToken) private readonly goalMapper: IGoalMapper
    ) {}

    @Get()
    @UseGuards(new AuthenticationGuard())
    public async getGoals(@Query() pageOptions: PageOptionsDto, @CurrentUser() author: User) {
        const result = await this.goalService.findAll(author.id, pageOptions);
        return this.goalMapper.fromModelToDtoPaginated(result);
    }

    @Get(":id")
    @UseGuards(new AuthenticationGuard())
    public async getGoalById(@Param("id", new ParseUUIDPipe()) goalId: string, @CurrentUser() author: User) {
        try {
            const result = await this.goalService.findOneById(author.id, goalId);
            return this.goalMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Post()
    @UseGuards(new AuthenticationGuard())
    public async createGoal(@Body() dto: CreateGoalDto, @CurrentUser() author: User) {
        const result = await this.goalService.create(author.id, dto);
        return this.goalMapper.fromModelToDto(result);
    }

    @Patch(":id/name")
    @UseGuards(new AuthenticationGuard())
    public async updateGoalsName(
        @Param("id", new ParseUUIDPipe()) goalId: string,
        @Body() dto: UpdateGoalsNameDto,
        @CurrentUser() author: User
    ) {
        try {
            const result = await this.goalService.updateName(author.id, goalId, dto.name);
            return this.goalMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Patch(":id/deadline")
    @UseGuards(new AuthenticationGuard())
    public async updateGoalsDeadline(
        @Param("id", new ParseUUIDPipe()) goalId: string,
        @Body() dto: UpdateGoalsDeadlineDto,
        @CurrentUser() author: User
    ) {
        try {
            const result = await this.goalService.updateDeadline(author.id, goalId, dto.deadline);
            return this.goalMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Delete(":id")
    @UseGuards(new AuthenticationGuard())
    public async deleteGoal(@Param("id", new ParseUUIDPipe()) goalId: string, @CurrentUser() author: User) {
        try {
            await this.goalService.deleteById(author.id, goalId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }
}
