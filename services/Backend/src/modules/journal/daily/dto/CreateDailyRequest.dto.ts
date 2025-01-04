import { IsDateString } from "class-validator";

import { IsDateOnly } from "@/lib/validation/decorators/IsDateOnly.decorator";

export class CreateDailyRequestDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly date: string;

    constructor({ date }: { date: string }) {
        this.date = date;
    }
}
