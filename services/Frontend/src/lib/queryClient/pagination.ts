import { PageDto } from "@/api/dto/PageDto";

export const getNextPage = (lastPage: PageDto<unknown>): number | null => {
    if (lastPage.meta.page === lastPage.meta.pageCount) {
        return null;
    }

    return lastPage.meta.page + 1;
};

export const getPreviousPage = (lastPage: PageDto<unknown>): number | null => {
    if (lastPage.meta.page === 1) {
        return null;
    }

    return lastPage.meta.page - 1;
};
