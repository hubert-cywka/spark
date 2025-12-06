import {IsOptional, IsString} from "class-validator";


export class GetFeatureFlagsDto {
    @IsOptional()
    @IsString()
    readonly key!: string;

    @IsOptional()
    @IsString()
    readonly tenantId!: string;
}
