import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";

import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AuthenticationGuard } from "@/common/guards/Authentication.guard";
import { CreateAlertDto } from "@/modules/alerts/dto/CreateAlert.dto";
import { UpdateAlertStatusDto } from "@/modules/alerts/dto/UpdateAlertStatus.dto";
import { UpdateAlertTimeDto } from "@/modules/alerts/dto/UpdateAlertTime.dto";
import { type IAlertMapper, AlertMapperToken } from "@/modules/alerts/mappers/IAlert.mapper";
import { type IAlertService, AlertServiceToken } from "@/modules/alerts/services/interfaces/IAlert.service";
import { type User } from "@/types/User";

@Controller("alert")
export class AlertsController {
    constructor(
        @Inject(AlertServiceToken) private readonly alertService: IAlertService,
        @Inject(AlertMapperToken) private readonly alertMapper: IAlertMapper
    ) {}

    @Get()
    @UseGuards(new AuthenticationGuard())
    public async getAlerts(@AuthenticatedUserContext() user: User) {
        const result = await this.alertService.getAll(user.id);
        return this.alertMapper.fromModelToDtoBulk(result);
    }

    @Post()
    @UseGuards(new AuthenticationGuard())
    public async createAlert(@Body() createAlertDto: CreateAlertDto, @AuthenticatedUserContext() user: User) {
        const { time, daysOfWeek } = createAlertDto;
        const result = await this.alertService.create(user.id, time, daysOfWeek);
        return this.alertMapper.fromModelToDto(result);
    }

    @Delete(":alertId")
    @UseGuards(new AuthenticationGuard())
    public async deleteAlert(@Param("alertId", new ParseUUIDPipe()) alertId: string, @AuthenticatedUserContext() user: User) {
        try {
            return await this.alertService.delete(user.id, alertId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Post(":alertId/restore")
    @UseGuards(new AuthenticationGuard())
    public async restoreAlert(@Param("alertId", new ParseUUIDPipe()) alertId: string, @AuthenticatedUserContext() user: User) {
        try {
            return await this.alertService.restore(user.id, alertId);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Patch(":alertId/status")
    @UseGuards(new AuthenticationGuard())
    public async changeAlertStatus(
        @Param("alertId", new ParseUUIDPipe()) alertId: string,
        @Body() updateAlertStatusDto: UpdateAlertStatusDto,
        @AuthenticatedUserContext() user: User
    ) {
        const { enabled } = updateAlertStatusDto;

        try {
            const result = await this.alertService.changeStatus(user.id, alertId, enabled);
            return this.alertMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Patch(":alertId/time")
    @UseGuards(new AuthenticationGuard())
    public async changeAlertTime(
        @Param("alertId", new ParseUUIDPipe()) alertId: string,
        @Body() updateAlertTimeDto: UpdateAlertTimeDto,
        @AuthenticatedUserContext() user: User
    ) {
        const { time, daysOfWeek } = updateAlertTimeDto;

        try {
            const result = await this.alertService.changeTime(user.id, alertId, time, daysOfWeek);
            return this.alertMapper.fromModelToDto(result);
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }
}
