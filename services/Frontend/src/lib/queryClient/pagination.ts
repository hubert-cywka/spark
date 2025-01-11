import { PageDto } from "@/api/dto/PageDto";

export const getNextPage = (lastPage: PageDto<unknown>): number | null => {
    if (!lastPage.meta.hasNextPage) {
        return null;
    }

    return lastPage.meta.page + 1;
};

export const getPreviousPage = (lastPage: PageDto<unknown>): number | null => {
    if (!lastPage.meta.hasPreviousPage) {
        return null;
    }

    return lastPage.meta.page - 1;
};
