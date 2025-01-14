import { Body, Controller, Delete, Inject, NotFoundException, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "@/common/decorators/CurrentUser.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AuthenticationGuard } from "@/common/guards/Authentication.guard";
import { CreateEntryDto } from "@/modules/journal/entries/dto/CreateEntry.dto";
import { UpdateEntryContentDto } from "@/modules/journal/entries/dto/UpdateEntryContent.dto";
import { type IEntryMapper, EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { type IEntryService, EntryServiceToken } from "@/modules/journal/entries/services/interfaces/IEntry.service";
import { type User } from "@/types/User";

@Controller("daily/:dailyId/entry")
export class DailyEntryController {
    public constructor(
        @Inject(EntryServiceToken) private readonly entryService: IEntryService,
        @Inject(EntryMapperToken) private readonly entryMapper: IEntryMapper
    ) {}

    @Post()
    @UseGuards(new AuthenticationGuard())
    public async createEntry(@Param("dailyId") dailyId: string, @CurrentUser() user: User, @Body() dto: CreateEntryDto) {
        try {
            const result = await this.entryService.create(user.id, dailyId, dto.content);
            return this.entryMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException());
        }
    }

    @Patch(":entryId/content")
    @UseGuards(new AuthenticationGuard())
    public async updateEntryContent(
        @Param("entryId") entryId: string,
        @Param("dailyId") dailyId: string,
        @CurrentUser() user: User,
        @Body() dto: UpdateEntryContentDto
    ) {
        try {
            const result = await this.entryService.updateContent(user.id, dailyId, entryId, dto.content);
            return this.entryMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException());
        }
    }

    // TODO: Add restore operation
    @Delete(":entryId")
    @UseGuards(new AuthenticationGuard())
    public async removeEntry(@Param("entryId") entryId: string, @Param("dailyId") dailyId: string, @CurrentUser() user: User) {
        try {
            await this.entryService.deleteById(user.id, dailyId, entryId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException());
        }
    }
}
