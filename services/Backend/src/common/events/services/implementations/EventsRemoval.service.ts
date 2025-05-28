import { Injectable, Logger } from "@nestjs/common";
import { And, IsNull, LessThan, Not, Repository } from "typeorm";

import { IntegrationEventEntity } from "@/common/events/entities/IntegrationEvent.entity";
import { IEventsRemovalService } from "@/common/events/services/interfaces/IEventsRemoval.service";

@Injectable()
export class EventsRemovalService implements IEventsRemovalService {
    private readonly logger = new Logger(EventsRemovalService.name);

    public constructor(private readonly repository: Repository<IntegrationEventEntity>) {}

    public async removeProcessedBefore(processedBefore: Date): Promise<void> {
        try {
            const result = await this.getRepository().delete({
                processedAt: And(LessThan(processedBefore), Not(IsNull())),
            });
            const count = result.affected ?? 0;
            this.logger.log({ processedBefore, count }, "Removed old events.");
        } catch (err) {
            this.logger.error({ processedBefore, err }, "Failed to remove old events.");
        }
    }

    public async removeByTenant(tenantId: string): Promise<void> {
        const result = await this.getRepository().delete({ tenantId });
        this.logger.log({ tenantId, events: result.affected }, "Deleted tenant's events.");
    }

    private getRepository(): Repository<IntegrationEventEntity> {
        return this.repository;
    }
}
