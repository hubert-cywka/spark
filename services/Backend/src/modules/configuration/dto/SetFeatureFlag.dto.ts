import { IsBoolean, IsString } from "class-validator";

export class SetFeatureFlagDto {
    @IsString()
    readonly key!: string;

    @IsBoolean()
    readonly value!: boolean;

    @IsString()
    readonly tenantIds!: string[];
}
