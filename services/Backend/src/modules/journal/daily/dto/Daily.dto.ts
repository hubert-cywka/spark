import { IsDateString, IsUUID } from "class-validator";

import { type ISODateString } from "@/types/Date";

export class DailyDto {
    @IsUUID("4")
    id!: string;

    @IsUUID("4")
    authorId!: string;

    @IsDateString()
    date!: ISODateString;

    @IsDateString()
    createdAt!: string;

    @IsDateString()
    updatedAt!: string;
}
