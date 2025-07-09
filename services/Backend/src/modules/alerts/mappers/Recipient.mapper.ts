import { plainToInstance } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { RecipientDto } from "@/modules/alerts/dto/Recipient.dto";
import { RecipientEntity } from "@/modules/alerts/entities/Recipient.entity";
import { type IRecipientMapper } from "@/modules/alerts/mappers/IRecipient.mapper";
import { type Recipient } from "@/modules/alerts/models/Recipient.model";

export class RecipientMapper extends BaseModelDTOEntityMapper<Recipient, RecipientDto, RecipientEntity> implements IRecipientMapper {
    fromDtoToModel(dto: RecipientDto): Recipient {
        return {
            id: dto.id,
        };
    }

    fromEntityToModel(entity: RecipientEntity): Recipient {
        return {
            id: entity.id,
        };
    }

    fromModelToDto(model: Recipient): RecipientDto {
        return plainToInstance(RecipientDto, {
            id: model.id,
        });
    }
}
