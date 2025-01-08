export type PageDto<T> = Readonly<{
    data: Readonly<T[]>;
    meta: Readonly<{
        page: number;
        take: number;
        itemCount: number;
        pageCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    }>;
}>;
