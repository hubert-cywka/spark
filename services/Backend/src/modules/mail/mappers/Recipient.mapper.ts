import { plainToInstance } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { RecipientDto } from "@/modules/mail/dto/Recipient.dto";
import { RecipientEntity } from "@/modules/mail/entities/Recipient.entity";
import { type IRecipientMapper } from "@/modules/mail/mappers/IRecipient.mapper";
import { type Recipient } from "@/modules/mail/models/Recipient.model";

export class RecipientMapper extends BaseModelDTOEntityMapper<Recipient, RecipientDto, RecipientEntity> implements IRecipientMapper {
    fromDtoToModel(dto: RecipientDto): Recipient {
        return {
            id: dto.id,
            email: dto.email,
        };
    }

    fromEntityToModel(entity: RecipientEntity): Recipient {
        return {
            id: entity.id,
            email: entity.email,
        };
    }

    fromModelToDto(model: Recipient): RecipientDto {
        return plainToInstance(RecipientDto, {
            id: model.id,
            email: model.email,
        });
    }
}
