import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

import { Order } from "@/common/pagination/types/Order";

export class PageOptionsDto {
    @IsEnum(Order)
    @IsOptional()
    readonly order: Order = Order.ASC;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    readonly take: number = 20;

    @IsString()
    @IsOptional()
    readonly cursor?: string;
}
