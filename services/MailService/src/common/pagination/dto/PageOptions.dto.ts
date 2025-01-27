import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

import { Order } from "@/common/pagination/types/Order";
import { PageOptions } from "@/common/pagination/types/PageOptions";

export class PageOptionsDto implements PageOptions {
    @IsEnum(Order)
    @IsOptional()
    readonly order: Order = Order.ASC;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    readonly take: number = 20;

    get skip(): number {
        return (this.page - 1) * this.take;
    }
}
