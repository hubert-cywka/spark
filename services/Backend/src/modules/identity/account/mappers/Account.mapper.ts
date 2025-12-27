import { plainToInstance } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { IAccountMapper } from "@/modules/identity/account/mappers/IAccount.mapper";
import { Account } from "@/modules/identity/account/models/Account.model";
import { AccountDto } from "@/modules/identity/shared/dto/Account.dto";

export class AccountMapper
    extends BaseModelDTOEntityMapper<Account, AccountDto, ManagedAccountEntity | FederatedAccountEntity>
    implements IAccountMapper
{
    fromEntityToModel(entity: ManagedAccountEntity | FederatedAccountEntity): Account {
        return plainToInstance(Account, {
            id: entity.id,
            providerAccountId: entity.providerAccountId,
            email: entity.email,
            providerId: entity.providerId,
        });
    }

    fromModelToDto(model: Account): AccountDto {
        return plainToInstance(AccountDto, {
            id: model.id,
            providerAccountId: model.providerAccountId,
            email: model.email,
            providerId: model.providerId,
        });
    }
}
