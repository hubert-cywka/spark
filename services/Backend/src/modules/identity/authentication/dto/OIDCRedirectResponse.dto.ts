import { IsString } from "class-validator";

export class OIDCRedirectResponseDto {
    @IsString()
    readonly url!: string;
}
