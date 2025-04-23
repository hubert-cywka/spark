import { Module } from "@nestjs/common";

import { IntegrationEventsModule } from "@/common/events";
import { IdentityEventBoxFactory } from "@/modules/identity/shared/services/IdentityEventBox.factory";

@Module({
    imports: [
        IntegrationEventsModule.forFeature({
            context: IdentitySharedModule.name,
            eventBoxFactory: {
                useClass: IdentityEventBoxFactory,
            },
        }),
    ],
    exports: [IntegrationEventsModule],
})
export class IdentitySharedModule {}
