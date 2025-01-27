import { IsString } from "class-validator";

export class RedeemActivationTokenDto {
    @IsString()
    readonly activationToken!: string;
}
