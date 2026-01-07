import { Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { applyCursorBasedPagination, createPage, createPaginationKeys } from "@/common/pagination/pagination";
import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";
import { GoalNotFoundError } from "@/modules/journal/goals/errors/GoalNotFound.error";
import { type IGoalMapper, GoalMapperToken } from "@/modules/journal/goals/mappers/IGoal.mapper";
import { Goal } from "@/modules/journal/goals/models/Goal.model";
import { GoalFilters } from "@/modules/journal/goals/models/GoalFilters.model";
import { type IGoalService } from "@/modules/journal/goals/services/interfaces/IGoalService";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

export class GoalService implements IGoalService {
    private readonly logger = new Logger(GoalService.name);

    public constructor(
        @InjectRepository(GoalEntity, JOURNAL_MODULE_DATA_SOURCE)
        private readonly repository: Repository<GoalEntity>,
        @Inject(GoalMapperToken) private readonly goalMapper: IGoalMapper
    ) {}

    // TODO: Sort goals by completed if 'withProgress' is set to true
    public async findAll(
        authorId: string,
        pageOptions: PageOptions,
        { entries, excludeEntries, name, withProgress, updatedAfter, updatedBefore }: GoalFilters = {}
    ): Promise<Paginated<Goal>> {
        const queryBuilder = this.getRepository().createQueryBuilder("goal").where("goal.authorId = :authorId", { authorId });

        const paginationKeys = createPaginationKeys(["createdAt", "id"]);
        applyCursorBasedPagination(queryBuilder, pageOptions, paginationKeys);

        if (updatedAfter) {
            queryBuilder.andWhere("goal.updatedAt >= :updatedAfter", { updatedAfter });
        }

        if (updatedBefore) {
            queryBuilder.andWhere("goal.updatedAt <= :updatedBefore", { updatedBefore });
        }

        if (withProgress) {
            queryBuilder
                .leftJoinAndSelect("goal.entries", "completedEntry", "completedEntry.isCompleted = true")
                .addSelect(["completedEntry.id"]);
        }

        if (entries?.length) {
            queryBuilder.innerJoin("goal.entries", "entry").andWhere("entry.id IN (:...entries)", { entries });
        }

        if (excludeEntries?.length) {
            queryBuilder
                .leftJoin(
                    "goal_entries",
                    "exclude_entries",
                    "exclude_entries.entryId IN (:...excludeEntries) AND exclude_entries.goalId = goal.id",
                    { excludeEntries }
                )
                .andWhere("exclude_entries.entryId IS NULL");
        }

        if (name) {
            queryBuilder.andWhere("goal.name ILIKE :name", {
                name: `%${name}%`,
            });
        }

        const result = await queryBuilder.getMany();
        const mappedResult = this.goalMapper.fromEntityToModelBulk(result);
        return createPage(mappedResult, pageOptions.take, paginationKeys);
    }

    public async getById(authorId: string, goalId: string): Promise<Goal> {
        const queryBuilder = this.getRepository()
            .createQueryBuilder("goal")
            .where("goal.id = :goalId", { goalId })
            .andWhere("goal.authorId = :authorId", { authorId })
            .leftJoinAndSelect("goal.entries", "completedEntry", "completedEntry.isCompleted = true")
            .addSelect(["completedEntry.id"]);

        const goal = await queryBuilder.getOne();

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
        return this.goalMapper.fromEntityToModel(insertedEntity);
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

    public async restoreById(authorId: string, goalId: string): Promise<void> {
        const result = await this.getRepository().restore({
            id: goalId,
            author: { id: authorId },
        });

        if (!result.affected) {
            this.logger.warn({ authorId, goalId }, "Goal not found, cannot restore.");
            throw new GoalNotFoundError();
        }
    }

    private async updateProperties(authorId: string, goalId: string, partialGoal: Partial<GoalEntity>): Promise<Goal> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .update(GoalEntity)
            .set({ ...partialGoal })
            .where("id = :goalId", { goalId })
            .andWhere("author.id = :authorId", { authorId })
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
        return this.repository;
    }
}
