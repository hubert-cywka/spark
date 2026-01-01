import { Module } from "@nestjs/common";

import { GoalController } from "@/modules/journal/goals/controllers/Goal.controller";
import { GoalEntryLinkController } from "@/modules/journal/goals/controllers/GoalEntryLink.controller";
import { GoalMapper } from "@/modules/journal/goals/mappers/Goal.mapper";
import { GoalMapperToken } from "@/modules/journal/goals/mappers/IGoal.mapper";
import { GoalEntryLinkService } from "@/modules/journal/goals/services/implementations/GoalEntryLinkService";
import { GoalsDataExportProvider } from "@/modules/journal/goals/services/implementations/GoalsDataExportProvider";
import { GoalService } from "@/modules/journal/goals/services/implementations/GoalService";
import { GoalEntryLinkServiceToken } from "@/modules/journal/goals/services/interfaces/IGoalEntryLinkService";
import { GoalServiceToken } from "@/modules/journal/goals/services/interfaces/IGoalService";
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
        {
            provide: GoalsDataExportProvider,
            useClass: GoalsDataExportProvider,
        },
    ],
    controllers: [GoalController, GoalEntryLinkController],
    exports: [GoalsDataExportProvider],
})
export class GoalsModule {}
