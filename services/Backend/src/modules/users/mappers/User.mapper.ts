import { plainToClass } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { UserDto } from "@/modules/users/dto/User.dto";
import { UserEntity } from "@/modules/users/entities/User.entity";
import { type IUserMapper } from "@/modules/users/mappers/IUser.mapper";
import { type User } from "@/modules/users/models/User.model";

export class UserMapper extends BaseModelDTOEntityMapper<User, UserDto, UserEntity> implements IUserMapper {
    fromDtoToModel(dto: UserDto): User {
        return {
            id: dto.id,
            email: dto.email,
            isActivated: dto.isActivated,
        };
    }

    fromEntityToModel(entity: UserEntity): User {
        return {
            id: entity.id,
            email: entity.email,
            isActivated: entity.isActivated,
        };
    }

    fromModelToDto(model: User): UserDto {
        return plainToClass(UserDto, {
            id: model.id,
            email: model.email,
            isActivated: model.isActivated,
        });
    }
}
