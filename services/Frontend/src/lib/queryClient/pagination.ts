import { PageDto } from "@/api/dto/PageDto";
import { PageCursor } from "@/api/types/PageCursor.ts";

export const getNextCursor = (lastPage: PageDto<unknown>): PageCursor => {
    return lastPage.meta.nextCursor;
};
