import { Module } from "@nestjs/common";

import { IntegrationEventsModule, IntegrationEventStreams, IntegrationEventTopics } from "@/common/events";
import { IdentityEventBoxFactory } from "@/modules/identity/shared/services/IdentityEventBox.factory";

@Module({
    imports: [
        IntegrationEventsModule.forFeature({
            context: IdentitySharedModule.name,
            eventBoxFactory: {
                useClass: IdentityEventBoxFactory,
            },
            consumers: [
                {
                    name: "codename_identity_account",
                    stream: IntegrationEventStreams.account,
                    subjects: [
                        IntegrationEventTopics.account.password.updated,
                        IntegrationEventTopics.account.activation.completed,
                        IntegrationEventTopics.account.removal.completed,
                        IntegrationEventTopics.account.removal.requested,
                        IntegrationEventTopics.account.suspended,
                    ],
                },
            ],
        }),
    ],
    exports: [IntegrationEventsModule],
})
export class IdentitySharedModule {}
