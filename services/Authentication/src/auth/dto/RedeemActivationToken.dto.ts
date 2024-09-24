import { IsString } from "class-validator";

export class RedeemActivationTokenDto {
    @IsString()
    activationToken!: string;
}
