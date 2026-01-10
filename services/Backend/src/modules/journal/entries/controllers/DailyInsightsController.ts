import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";
import { plainToInstance } from "class-transformer";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { Timezone } from "@/common/decorators/Timezone.decorator";
import { AccessGuard } from "@/common/guards/Access.guard";
import { DailyMetricsDto } from "@/modules/journal/entries/dto/DailyMetrics.dto";
import { FindDailyMetricsDto } from "@/modules/journal/entries/dto/FindDailyMetrics.dto";
import {
    type IDailyInsightsProvider,
    DailyInsightsProviderToken,
} from "@/modules/journal/entries/services/interfaces/IDailyInsightsProvider";
import { type User } from "@/types/User";

@Controller("daily")
export class DailyInsightsController {
    public constructor(
        @Inject(DailyInsightsProviderToken)
        private readonly insightsService: IDailyInsightsProvider
    ) {}

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
}
