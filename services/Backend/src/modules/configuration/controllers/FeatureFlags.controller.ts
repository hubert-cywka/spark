import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";

import { GetFeatureFlagsDto } from "@/modules/configuration/dto/GetFeatureFlags.dto";
import { SetFeatureFlagDto } from "@/modules/configuration/dto/SetFeatureFlag.dto";
import { type IFeatureFlagMapper, FeatureFlagMapperToken } from "@/modules/configuration/mappers/IFeatureFlag.mapper";
import { type IFeatureFlagService, FeatureFlagServiceToken } from "@/modules/configuration/services/interfaces/IFeatureFlagService";

@Controller("internal/configuration/feature-flag")
export class FeatureFlagsController {
    public constructor(
        @Inject(FeatureFlagMapperToken)
        private readonly featureFlagMapper: IFeatureFlagMapper,
        @Inject(FeatureFlagServiceToken)
        private readonly featureFlagService: IFeatureFlagService
    ) {}

    @Get()
    public async getFeatureFlags(@Query() { key, tenantId }: GetFeatureFlagsDto) {
        const flags = await this.featureFlagService.get({ key, tenantId });
        return this.featureFlagMapper.fromModelToDtoBulk(flags);
    }

    @Post()
    public async setFeatureFlag(@Body() dto: SetFeatureFlagDto) {
        await this.featureFlagService.set(dto.tenantIds, dto.key, dto.value);
    }

    @Delete(":id")
    public async removeFeatureFlag(@Param("id", new ParseUUIDPipe()) flagId: string) {
        await this.featureFlagService.remove(flagId);
    }
}
