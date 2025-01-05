import { type IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { Account } from "@/modules/identity/account/models/Account.model";
import { AccountDto } from "@/modules/identity/shared/dto/Account.dto";

export const AccountMapperToken = Symbol("AccountMapper");

export interface IAccountMapper extends IModelDTOEntityMapper<Account, AccountDto, FederatedAccountEntity | ManagedAccountEntity> {}
