import { PageMeta } from "@/common/pagination/types/PageMeta";

export class PageMetaDto {
    readonly nextCursor: string | null;
    readonly hasNextPage: boolean;

    constructor(meta: PageMeta) {
        this.nextCursor = meta.nextCursor;
        this.hasNextPage = meta.hasNextPage;
    }
}
