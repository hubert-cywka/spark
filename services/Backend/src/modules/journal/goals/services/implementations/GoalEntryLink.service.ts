import { Logger } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Repository } from "typeorm";

import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";
import { GoalEntryLinkNotFoundError } from "@/modules/journal/goals/errors/GoalEntryLinkNotFound.error";
import { GoalOrEntryNotFoundError } from "@/modules/journal/goals/errors/GoalOrEntryNotFound.error";
import { type IGoalEntryLinkService } from "@/modules/journal/goals/services/interfaces/IGoalEntryLink.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

export class GoalEntryLinkService implements IGoalEntryLinkService {
    private readonly logger = new Logger(GoalEntryLinkService.name);

    public constructor(
        @InjectTransactionHost(JOURNAL_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    public async createLink(authorId: string, goalId: string, entryId: string): Promise<void> {
        await this.assertOwnership(authorId, goalId, entryId);
        await this.getRepository().createQueryBuilder().insert().into("goal_entries").values({ goalId, entryId }).orIgnore().execute();
    }

    public async removeLink(authorId: string, goalId: string, entryId: string): Promise<void> {
        await this.assertOwnership(authorId, goalId, entryId);
        const result = await this.getRepository()
            .createQueryBuilder()
            .delete()
            .from("goal_entries")
            .where("goalId = :goalId", { goalId })
            .andWhere("entryId = :entryId", { entryId })
            .execute();

        if (!result.affected) {
            throw new GoalEntryLinkNotFoundError();
        }
    }

    private async assertOwnership(authorId: string, goalId: string, entryId: string): Promise<void> {
        const count = await this.getRepository()
            .createQueryBuilder()
            .from(GoalEntity, "goal")
            .innerJoin(EntryEntity, "entry", "entry.id = :entryId AND entry.authorId = goal.authorId", { entryId })
            .where("goal.id = :goalId", { goalId })
            .andWhere("goal.authorId = :authorId", { authorId })
            .getCount();

        if (count === 0) {
            this.logger.warn({ authorId, goalId, entryId }, "Couldn't find goal or entry with that id belonging to that author.");
            throw new GoalOrEntryNotFoundError();
        }
    }

    private getRepository(): Repository<GoalEntity> {
        return this.txHost.tx.getRepository(GoalEntity);
    }
}
