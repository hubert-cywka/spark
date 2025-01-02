import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class OIDCRedirectResponseDto {
    @Expose()
    @IsString()
    url!: string;
}
