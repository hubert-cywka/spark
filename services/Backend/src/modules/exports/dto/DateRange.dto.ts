import { IsISOTime } from "@/lib/validation/decorators/IsISOTime.decorator";

export class DateRangeDto {
    @IsISOTime()
    readonly from!: Date;

    @IsISOTime()
    readonly to!: Date;
}
