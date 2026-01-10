import { UpdateEntryRequestDto } from "@/features/entries/api/dto/UpdateEntryRequestDto.ts";

export type BulkUpdateEntryRequestDto = {
    ids: string[];
    value: UpdateEntryRequestDto;
};
