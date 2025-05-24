import { Injectable, Logger } from "@nestjs/common";
import { And, IsNull, LessThan, Not, Repository } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { type IEventsRemover } from "@/common/events/services/interfaces/IEventsRemover";

@Injectable()
export class EventsRemover implements IEventsRemover {
    private readonly logger = new Logger(EventsRemover.name);

    public async removeProcessedBefore(processedBefore: Date, repository: Repository<OutboxEventEntity | InboxEventEntity>): Promise<void> {
        try {
            const result = await repository.delete({
                processedAt: And(LessThan(processedBefore), Not(IsNull())),
            });
            const count = result.affected ?? 0;
            this.logger.log({ processedBefore, count }, "Removed old events.");
        } catch (err) {
            this.logger.error({ processedBefore, err }, "Failed to remove old events.");
        }
    }

    public async removeByTenant(tenantId: string, repository: Repository<OutboxEventEntity | InboxEventEntity>): Promise<void> {
        const result = await repository.delete({ tenantId });
        this.logger.log({ tenantId, events: result.affected }, "Deleted tenant's events.");
    }
}
