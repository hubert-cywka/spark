import { Module } from "@nestjs/common";

import { IntegrationEventsModule } from "@/common/events";
import { JournalEventBoxFactory } from "@/modules/journal/services/implementations/JournalEventBox.factory";

@Module({
    providers: [],
    imports: [
        IntegrationEventsModule.forFeature({
            eventBoxFactoryClass: JournalEventBoxFactory,
            context: JournalSharedModule.name,
        }),
    ],
    exports: [IntegrationEventsModule],
})
export class JournalSharedModule {}
