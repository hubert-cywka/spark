import { type IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { RecipientDto } from "@/modules/mail/dto/Recipient.dto";
import { RecipientEntity } from "@/modules/mail/entities/Recipient.entity";
import { Recipient } from "@/modules/mail/models/Recipient.model";

export const RecipientMapperToken = Symbol("RecipientMapper");

export interface IRecipientMapper extends IModelDTOEntityMapper<Recipient, RecipientDto, RecipientEntity> {}
