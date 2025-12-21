import { And, FindOptionsWhere, IsNull, LessThan, Not, Repository } from "typeorm";

import { IntegrationEventEntity } from "@/common/events/entities/IntegrationEvent.entity";
import {
    IIntegrationEventRepository,
    RemoveProcessedEventsOptions,
} from "@/common/events/repositories/interfaces/IIntegrationEvent.repository";

export class IntegrationEventRepository<T extends IntegrationEventEntity = IntegrationEventEntity>
    implements IIntegrationEventRepository<T>
{
    public constructor(protected readonly repository: Repository<T>) {}

    public async removeProcessed({ processedBefore }: RemoveProcessedEventsOptions) {
        await this.repository.delete({
            processedAt: And(LessThan(processedBefore), Not(IsNull())),
        } as FindOptionsWhere<T>);
    }

    public async removeAll() {
        await this.repository.deleteAll();
    }

    public async countUnprocessed(): Promise<number> {
        return await this.repository.count({
            where: { processedAt: IsNull() } as FindOptionsWhere<T>,
        });
    }

    public async getById(eventId: string): Promise<T | null> {
        return await this.repository.findOne({
            where: { id: eventId } as FindOptionsWhere<T>,
        });
    }
}
