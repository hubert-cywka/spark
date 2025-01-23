import { IsISOTime } from "@/lib/validation/decorators/IsISOTime.decorator";

export class UpdateAlertTimeDto {
    @IsISOTime()
    time!: string;
}
