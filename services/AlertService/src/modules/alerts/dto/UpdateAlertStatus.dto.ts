import { IsBoolean } from "class-validator";

export class UpdateAlertStatusDto {
    @IsBoolean()
    enabled!: boolean;
}
