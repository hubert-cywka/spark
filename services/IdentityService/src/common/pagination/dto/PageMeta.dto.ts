import { PageMeta } from "@/common/pagination/types/PageMeta";
import { PageMetaDtoParameters } from "@/common/pagination/types/PageMetaDtoParameters";

export class PageMetaDto implements PageMeta {
    readonly page: number;
    readonly take: number;
    readonly itemCount: number;
    readonly pageCount: number;
    readonly hasPreviousPage: boolean;
    readonly hasNextPage: boolean;

    constructor({ page, take, itemCount }: PageMetaDtoParameters) {
        this.page = page;
        this.take = take;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}
