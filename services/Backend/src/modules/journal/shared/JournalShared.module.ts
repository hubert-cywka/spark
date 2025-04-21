import { Module } from "@nestjs/common";

import { IntegrationEventsModule, IntegrationEventStreams, IntegrationEventTopics } from "@/common/events";
import { JournalEventBoxFactory } from "@/modules/journal/services/implementations/JournalEventBox.factory";

@Module({
    providers: [],
    imports: [
        IntegrationEventsModule.forFeatureAsync({
            useFactory: () => ({
                handlers: [],
            }),
            eventBoxFactoryClass: JournalEventBoxFactory,
            context: JournalSharedModule.name,
            consumers: [
                {
                    name: "codename_journal_account",
                    stream: IntegrationEventStreams.account,
                    subjects: [IntegrationEventTopics.account.registration.completed, IntegrationEventTopics.account.removal.completed],
                },
            ],
        }),
    ],
    exports: [IntegrationEventsModule],
})
export class JournalSharedModule {}
