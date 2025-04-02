import { IsString } from "class-validator";

export class EnableApp2FADto {
    @IsString()
    readonly url!: string;
}
