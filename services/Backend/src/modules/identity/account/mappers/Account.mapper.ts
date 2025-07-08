import { plainToInstance } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { IAccountMapper } from "@/modules/identity/account/mappers/IAccount.mapper";
import { Account } from "@/modules/identity/account/models/Account.model";
import { FederatedAccountProvider, ManagedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";
import { AccountDto } from "@/modules/identity/shared/dto/Account.dto";

export class AccountMapper
    extends BaseModelDTOEntityMapper<Account, AccountDto, ManagedAccountEntity | FederatedAccountEntity>
    implements IAccountMapper
{
    fromDtoToModel(dto: AccountDto): Account {
        return {
            id: dto.id,
            providerAccountId: dto.providerAccountId,
            email: dto.email,
            providerId: dto.providerId as ManagedAccountProvider | FederatedAccountProvider,
        };
    }

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
