import { Module } from "@nestjs/common";

import { GoalController } from "@/modules/journal/goals/controllers/Goal.controller";
import { GoalMapper } from "@/modules/journal/goals/mappers/Goal.mapper";
import { GoalMapperToken } from "@/modules/journal/goals/mappers/IGoal.mapper";
import { GoalService } from "@/modules/journal/goals/services/implementations/Goal.service";
import { GoalServiceToken } from "@/modules/journal/goals/services/interfaces/IGoal.service";
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
    ],
    controllers: [GoalController],
})
export class GoalsModule {}
