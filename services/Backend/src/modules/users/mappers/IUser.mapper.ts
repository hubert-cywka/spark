import { IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { UserDto } from "@/modules/users/dto/User.dto";
import { UserEntity } from "@/modules/users/entities/User.entity";
import { User } from "@/modules/users/models/User.model";

export const UserMapperToken = Symbol("UserMapper");

export interface IUserMapper extends IModelDTOEntityMapper<User, UserDto, UserEntity> {}
