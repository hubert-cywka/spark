import { PageMeta } from "@/common/pagination/types/PageMeta";

export interface Paginated<T> {
    data: T[];
    meta: PageMeta;
}
