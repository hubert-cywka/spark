import { Body, Controller, Delete, Inject, NotFoundException, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AccessGuard } from "@/common/guards/Access.guard";
import { CreateEntryDto } from "@/modules/journal/entries/dto/CreateEntry.dto";
import { UpdateEntryContentDto } from "@/modules/journal/entries/dto/UpdateEntryContent.dto";
import { UpdateEntryIsFeaturedDto } from "@/modules/journal/entries/dto/UpdateEntryIsFeatured.dto";
import { UpdateEntryStatusDto } from "@/modules/journal/entries/dto/UpdateEntryStatus.dto";
import { type IEntryMapper, EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { type IEntryService, EntryServiceToken } from "@/modules/journal/entries/services/interfaces/IEntryService";
import { type User } from "@/types/User";

@Controller("daily/:dailyId/entry")
export class DailyEntryController {
    public constructor(
        @Inject(EntryServiceToken) private readonly entryService: IEntryService,
        @Inject(EntryMapperToken) private readonly entryMapper: IEntryMapper
    ) {}

    @Post()
    @UseGuards(AccessGuard)
    @AccessScopes("write:entry")
    public async createEntry(@Param("dailyId") dailyId: string, @AuthenticatedUserContext() user: User, @Body() dto: CreateEntryDto) {
        try {
            const result = await this.entryService.create(user.id, dailyId, {
                content: dto.content,
                isFeatured: dto.isFeatured ?? false,
                isCompleted: dto.isCompleted ?? false,
            });
            return this.entryMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException());
        }
    }

    @Patch(":entryId/content")
    @UseGuards(AccessGuard)
    @AccessScopes("write:entry")
    public async updateEntryContent(
        @Param("entryId") entryId: string,
        @Param("dailyId") dailyId: string,
        @AuthenticatedUserContext() user: User,
        @Body() dto: UpdateEntryContentDto
    ) {
        try {
            const result = await this.entryService.update(user.id, dailyId, entryId, { content: dto.content });
            return this.entryMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException());
        }
    }

    @Patch(":entryId/completed")
    @UseGuards(AccessGuard)
    @AccessScopes("write:entry")
    public async updateEntryStatus(
        @Param("entryId") entryId: string,
        @Param("dailyId") dailyId: string,
        @AuthenticatedUserContext() user: User,
        @Body() dto: UpdateEntryStatusDto
    ) {
        try {
            const result = await this.entryService.update(user.id, dailyId, entryId, { isCompleted: dto.isCompleted });
            return this.entryMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException());
        }
    }

    @Patch(":entryId/featured")
    @UseGuards(AccessGuard)
    @AccessScopes("write:entry")
    public async updateEntryIsFeatured(
        @Param("entryId") entryId: string,
        @Param("dailyId") dailyId: string,
        @AuthenticatedUserContext() user: User,
        @Body() dto: UpdateEntryIsFeaturedDto
    ) {
        try {
            const result = await this.entryService.update(user.id, dailyId, entryId, { isFeatured: dto.isFeatured });
            return this.entryMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException());
        }
    }

    @Delete(":entryId")
    @UseGuards(AccessGuard)
    @AccessScopes("delete:entry")
    public async removeEntry(@Param("entryId") entryId: string, @Param("dailyId") dailyId: string, @AuthenticatedUserContext() user: User) {
        try {
            await this.entryService.deleteById(user.id, dailyId, entryId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException());
        }
    }

    @Post(":entryId/restore")
    @UseGuards(AccessGuard)
    @AccessScopes("write:entry")
    public async restoreEntry(
        @Param("entryId") entryId: string,
        @Param("dailyId") dailyId: string,
        @AuthenticatedUserContext() user: User
    ) {
        try {
            await this.entryService.restoreById(user.id, dailyId, entryId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException());
        }
    }
}
