import { Module } from "@nestjs/common";

import { GoalController } from "@/modules/journal/goals/controllers/Goal.controller";
import { GoalEntryLinkController } from "@/modules/journal/goals/controllers/GoalEntryLink.controller";
import { GoalMapper } from "@/modules/journal/goals/mappers/Goal.mapper";
import { GoalMapperToken } from "@/modules/journal/goals/mappers/IGoal.mapper";
import { GoalService } from "@/modules/journal/goals/services/implementations/Goal.service";
import { GoalEntryLinkService } from "@/modules/journal/goals/services/implementations/GoalEntryLink.service";
import { GoalServiceToken } from "@/modules/journal/goals/services/interfaces/IGoal.service";
import { GoalEntryLinkServiceToken } from "@/modules/journal/goals/services/interfaces/IGoalEntryLink.service";
import { JournalSharedModule } from "@/modules/journal/shared/JournalShared.module";

@Module({
    imports: [JournalSharedModule],
    providers: [
        {
            provide: GoalMapperToken,
            useClass: GoalMapper,
        },
        {
            provide: GoalServiceToken,
            useClass: GoalService,
        },
        {
            provide: GoalEntryLinkServiceToken,
            useClass: GoalEntryLinkService,
        },
    ],
    controllers: [GoalController, GoalEntryLinkController],
})
export class GoalsModule {}
