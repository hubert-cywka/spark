import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from "@nestjs/common";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AccessGuard } from "@/common/guards/Access.guard";
import { PageOptionsDto } from "@/common/pagination/dto/PageOptions.dto";
import { CreateOrUpdateGoalDto } from "@/modules/journal/goals/dto/CreateOrUpdateGoal.dto";
import { FindGoalsFiltersDto } from "@/modules/journal/goals/dto/FindGoalsFilters.dto";
import { type IGoalMapper, GoalMapperToken } from "@/modules/journal/goals/mappers/IGoal.mapper";
import { type IGoalService, GoalServiceToken } from "@/modules/journal/goals/services/interfaces/IGoalService";
import { type User } from "@/types/User";

@Controller("goal")
export class GoalController {
    public constructor(
        @Inject(GoalServiceToken) private readonly goalService: IGoalService,
        @Inject(GoalMapperToken) private readonly goalMapper: IGoalMapper
    ) {}

    @Get()
    @UseGuards(AccessGuard)
    @AccessScopes("read:goal")
    public async getGoals(
        @Query() filters: FindGoalsFiltersDto,
        @Query() pageOptions: PageOptionsDto,
        @AuthenticatedUserContext() author: User
    ) {
        const result = await this.goalService.findAll(author.id, pageOptions, filters);
        return this.goalMapper.fromModelToDtoPage(result);
    }

    @Get(":id")
    @UseGuards(AccessGuard)
    @AccessScopes("read:goal")
    public async getGoalById(@Param("id", new ParseUUIDPipe()) goalId: string, @AuthenticatedUserContext() author: User) {
        try {
            const result = await this.goalService.getById(author.id, goalId);
            return this.goalMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Post()
    @UseGuards(AccessGuard)
    @AccessScopes("write:goal")
    public async createGoal(@Body() dto: CreateOrUpdateGoalDto, @AuthenticatedUserContext() author: User) {
        const result = await this.goalService.create(author.id, dto);
        return this.goalMapper.fromModelToDto(result);
    }

    @Put(":id")
    @UseGuards(AccessGuard)
    @AccessScopes("write:goal")
    public async updateGoalsName(
        @Param("id", new ParseUUIDPipe()) goalId: string,
        @Body() dto: CreateOrUpdateGoalDto,
        @AuthenticatedUserContext() author: User
    ) {
        try {
            const result = await this.goalService.update(author.id, goalId, dto);
            return this.goalMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Delete(":id")
    @UseGuards(AccessGuard)
    @AccessScopes("delete:goal")
    public async deleteGoal(@Param("id", new ParseUUIDPipe()) goalId: string, @AuthenticatedUserContext() author: User) {
        try {
            await this.goalService.deleteById(author.id, goalId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Post(":id/restore")
    @UseGuards(AccessGuard)
    @AccessScopes("write:goal")
    public async restoreGoal(@Param("id", new ParseUUIDPipe()) goalId: string, @AuthenticatedUserContext() author: User) {
        try {
            await this.goalService.restoreById(author.id, goalId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }
}
