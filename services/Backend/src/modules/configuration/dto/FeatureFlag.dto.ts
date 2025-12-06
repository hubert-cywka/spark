import { IsBoolean, IsString } from "class-validator";

export class FeatureFlagDto {
    @IsString()
    readonly id!: string;

    @IsString()
    readonly key!: string;

    @IsBoolean()
    readonly value!: boolean;

    @IsString()
    readonly tenantId!: string;
}
