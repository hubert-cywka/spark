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
        const queryBuilder = this.getRepository().createQueryBuilder("goal");

        queryBuilder
            .where("goal.authorId = :authorId", { authorId })
            .leftJoinAndMapMany("goal.entries", "goal.entries", "entry", "entry.isCompleted = true")
            .select(["goal", "entry.id"])
            .orderBy("goal.createdAt", pageOptions.order)
            .skip(pageOptions.skip)
            .take(pageOptions.take);

        const [goals, itemCount] = await queryBuilder.getManyAndCount();

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
        const goal = await this.getRepository()
            .createQueryBuilder("goal")
            .where("goal.id = :goalId", { goalId })
            .andWhere("goal.authorId = :authorId", { authorId })
            .leftJoinAndMapMany("goal.entries", "goal.entries", "entry", "entry.isCompleted = true")
            .select(["goal", "entry.id"])
            .getOne();

        if (!goal) {
            this.logger.warn({ authorId, goalId }, "Goal not found.");
            throw new GoalNotFoundError();
        }

        return this.goalMapper.fromEntityToModel(goal);
    }

    public async create(authorId: string, goal: Pick<Goal, "name" | "deadline"> & { target: number }): Promise<Goal> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .insert()
            .into(GoalEntity)
            .values({
                name: goal.name,
                deadline: goal.deadline,
                target: goal.target,
                author: { id: authorId },
            })
            .returning("*")
            .execute();

        const insertedEntity = result.raw[0] as GoalEntity;
        return this.goalMapper.fromEntityToModel({
            ...insertedEntity,
            entries: [],
        });
    }

    public async update(
        authorId: string,
        goalId: string,
        { name, deadline, target }: Pick<Goal, "name" | "deadline"> & { target: number }
    ): Promise<Goal> {
        return await this.updateProperties(authorId, goalId, {
            name,
            deadline,
            target,
        });
    }

    public async deleteById(authorId: string, goalId: string): Promise<void> {
        const result = await this.getRepository().softDelete({
            id: goalId,
            author: { id: authorId },
        });

        if (!result.affected) {
            this.logger.warn({ authorId, goalId }, "Goal not found, cannot delete.");
            throw new GoalNotFoundError();
        }
    }

    private async updateProperties(authorId: string, goalId: string, partialGoal: Partial<GoalEntity>): Promise<Goal> {
        return await this.txHost.withTransaction(async () => {
            const result = await this.getRepository()
                .createQueryBuilder()
                .update(GoalEntity)
                .set({ ...partialGoal })
                .where("id = :goalId", { goalId })
                .andWhere("author.id = :authorId", { authorId })
                .execute();

            if (!result.affected) {
                this.logger.warn({ authorId, goalId }, "Goal not found, cannot update.");
                throw new GoalNotFoundError();
            }

            return this.findOneById(authorId, goalId);
        });
    }

    private getRepository(): Repository<GoalEntity> {
        return this.txHost.tx.getRepository(GoalEntity);
    }
}
