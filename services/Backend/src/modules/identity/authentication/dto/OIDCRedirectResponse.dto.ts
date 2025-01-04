import { IsString } from "class-validator";

export class OIDCRedirectResponseDto {
    @IsString()
    url!: string;
}
