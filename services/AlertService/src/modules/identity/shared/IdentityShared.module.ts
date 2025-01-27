import { Module } from "@nestjs/common";

import { IntegrationEventsModule } from "@/common/events";
import { IdentityEventBoxFactory } from "@/modules/identity/shared/services/IdentityEventBox.factory";

@Module({
    imports: [
        IntegrationEventsModule.forFeature({
            eventBoxFactoryClass: IdentityEventBoxFactory,
            context: IdentitySharedModule.name,
        }),
    ],
    exports: [IntegrationEventsModule],
})
export class IdentitySharedModule {}
