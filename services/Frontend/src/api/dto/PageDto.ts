import { PageCursor } from "@/api/types/PageCursor.ts";

export type PageDto<T> = Readonly<{
    data: Readonly<T[]>;
    meta: Readonly<{
        nextCursor: PageCursor;
        hasNextPage: boolean;
    }>;
}>;
