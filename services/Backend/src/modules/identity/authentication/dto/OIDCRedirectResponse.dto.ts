import { IsString } from "class-validator";

export class OIDCRedirectResponseDto {
    @IsString()
    readonly url: string;

    constructor({ url }: { url: string }) {
        this.url = url;
    }
}
