import { Body, Controller, Delete, Inject, NotFoundException, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AccessGuard } from "@/common/guards/Access.guard";
import { LinkEntryWithGoalDto } from "@/modules/journal/goals/dto/LinkEntryWithGoal.dto";
import { type IGoalEntryLinkService, GoalEntryLinkServiceToken } from "@/modules/journal/goals/services/interfaces/IGoalEntryLink.service";
import { type User } from "@/types/User";

@Controller("goal/:goalId/entry")
export class GoalEntryLinkController {
    public constructor(
        @Inject(GoalEntryLinkServiceToken)
        private readonly goalEntryLinkService: IGoalEntryLinkService
    ) {}

    @Post()
    @UseGuards(AccessGuard)
    @AccessScopes("write:goal", "write:entry")
    public async createLink(
        @Param("goalId", new ParseUUIDPipe()) goalId: string,
        @Body() dto: LinkEntryWithGoalDto,
        @AuthenticatedUserContext() author: User
    ) {
        try {
            await this.goalEntryLinkService.createLink(author.id, goalId, dto.entryId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Delete(":entryId")
    @UseGuards(AccessGuard)
    @AccessScopes("write:goal", "write:entry")
    public async removeLink(
        @Param("goalId", new ParseUUIDPipe()) goalId: string,
        @Param("entryId", new ParseUUIDPipe()) entryId: string,
        @AuthenticatedUserContext() author: User
    ) {
        try {
            await this.goalEntryLinkService.removeLink(author.id, goalId, entryId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }
}
