import { Inject, Logger } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Repository } from "typeorm";

import { PageMetaDto } from "@/common/pagination/dto/PageMeta.dto";
import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";
import { GoalNotFoundError } from "@/modules/journal/goals/errors/GoalNotFound.error";
import { type IGoalMapper, GoalMapperToken } from "@/modules/journal/goals/mappers/IGoal.mapper";
import { Goal } from "@/modules/journal/goals/models/Goal.model";
import { type IGoalService } from "@/modules/journal/goals/services/interfaces/IGoal.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

export class GoalService implements IGoalService {
    private readonly logger = new Logger(GoalService.name);

    public constructor(
        @InjectTransactionHost(JOURNAL_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(GoalMapperToken) private readonly goalMapper: IGoalMapper
    ) {}

    public async findAll(authorId: string, pageOptions: PageOptions): Promise<Paginated<Goal>> {
        const queryBuilder = this.getRepository().createQueryBuilder();

        queryBuilder.orderBy("createdAt", pageOptions.order).skip(pageOptions.skip).take(pageOptions.take);
        const itemCount = await queryBuilder.getCount();

        const goals = await queryBuilder.where("authorId = :authorId", { authorId }).getMany();

        // TODO: Do not use DTOs here
        return {
            data: this.goalMapper.fromEntityToModelBulk(goals),
            meta: new PageMetaDto({
                itemCount,
                page: pageOptions.page,
                take: pageOptions.take,
            }),
        };
    }

    public async findOneById(authorId: string, goalId: string): Promise<Goal> {
        const goal = await this.getRepository().findOne({
            where: { id: goalId, authorId },
        });

        if (!goal) {
            this.logger.warn({ authorId, goalId }, "Goal not found.");
            throw new GoalNotFoundError();
        }

        return this.goalMapper.fromEntityToModel(goal);
    }

    public async create(authorId: string, goal: Pick<Goal, "name" | "deadline">): Promise<Goal> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .insert()
            .into(GoalEntity)
            .values({
                name: goal.name,
                deadline: goal.deadline,
                author: { id: authorId },
            })
            .returning("*")
            .execute();

        const insertedEntity = result.raw[0] as GoalEntity;
        return this.goalMapper.fromEntityToModel(insertedEntity);
    }

    public async updateName(authorId: string, goalId: string, name: string): Promise<Goal> {
        return await this.updateProperties(authorId, goalId, { name });
    }

    public async updateDeadline(authorId: string, goalId: string, deadline: Date): Promise<Goal> {
        return await this.updateProperties(authorId, goalId, { deadline });
    }

    public async deleteById(authorId: string, goalId: string): Promise<void> {
        const result = await this.getRepository().softDelete({
            id: goalId,
            authorId,
        });

        if (!result.affected) {
            this.logger.warn({ authorId, goalId }, "Goal not found, cannot delete.");
            throw new GoalNotFoundError();
        }
    }

    private async updateProperties(authorId: string, goalId: string, partialGoal: Partial<Goal>): Promise<Goal> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .update(GoalEntity)
            .set({ ...partialGoal })
            .where("id = :goalId AND authorId = :authorId", {
                goalId,
                authorId,
            })
            .returning("*")
            .execute();

        const updatedEntity = result.raw[0] as GoalEntity;

        if (!updatedEntity) {
            this.logger.warn({ authorId, goalId }, "Goal not found, cannot update.");
            throw new GoalNotFoundError();
        }

        return this.goalMapper.fromEntityToModel(updatedEntity);
    }

    private getRepository(): Repository<GoalEntity> {
        return this.txHost.tx.getRepository(GoalEntity);
    }
}
