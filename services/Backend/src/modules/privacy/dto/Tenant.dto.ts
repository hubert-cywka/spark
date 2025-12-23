import { IsString } from "class-validator";

export class TenantDto {
    @IsString()
    readonly id!: string;
}
