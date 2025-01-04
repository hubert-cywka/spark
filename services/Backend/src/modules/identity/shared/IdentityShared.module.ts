import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

import { IntegrationEventsModule } from "@/common/events";
import { IdentityEventBoxFactory } from "@/modules/identity/shared/services/IdentityEventBox.factory";

@Module({
    imports: [
        IntegrationEventsModule.forFeature({
            eventBoxFactoryClass: IdentityEventBoxFactory,
            context: IdentitySharedModule.name,
        }),
        ThrottlerModule.forRootAsync({
            useFactory: (configService: ConfigService) => [
                {
                    ttl: configService.getOrThrow<number>("modules.identity.throttle.ttl"),
                    limit: configService.getOrThrow<number>("modules.identity.throttle.limit"),
                },
            ],
            inject: [ConfigService],
        }),
    ],
    exports: [IntegrationEventsModule, ThrottlerModule],
})
export class IdentitySharedModule {}
