import { Type } from "class-transformer";
import { IsArray } from "class-validator";

import { PageMetaDto } from "@/common/pagination/dto/PageMeta.dto";
import { Paginated } from "@/common/pagination/types/Paginated";

export class PageDto<T> implements Paginated<T> {
    @IsArray()
    readonly data: T[];

    @Type((type) => PageMetaDto)
    readonly meta: PageMetaDto;

    constructor(data: T[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
