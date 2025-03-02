import { type IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { RecipientDto } from "@/modules/alerts/dto/Recipient.dto";
import { RecipientEntity } from "@/modules/alerts/entities/Recipient.entity";
import { Recipient } from "@/modules/alerts/models/Recipient.model";

export const RecipientMapperToken = Symbol("RecipientMapper");

export interface IRecipientMapper extends IModelDTOEntityMapper<Recipient, RecipientDto, RecipientEntity> {}
