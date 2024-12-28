import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { initializeDatabase } from "@/common/utils/initializeDatabase";
import { logger } from "@/lib/logger";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { InitDatabase1731437155592 } from "@/modules/identity/infrastructure/database/migrations/1731437155592-InitDatabase";
import { ImplementOutbox1735337349949 } from "@/modules/identity/infrastructure/database/migrations/1735337349949-ImplementOutbox";
import { ChangeTimestampsFormat1735340489564 } from "@/modules/identity/infrastructure/database/migrations/1735340489564-ChangeTimestampsFormat";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            name: IDENTITY_MODULE_DATA_SOURCE,
            useFactory: async (configService: ConfigService) => {
                const options = {
                    port: configService.getOrThrow<number>("modules.auth.database.port"),
                    username: configService.getOrThrow<string>("modules.auth.database.username"),
                    password: configService.getOrThrow<string>("modules.auth.database.password"),
                    host: configService.getOrThrow<string>("modules.auth.database.host"),
                    database: configService.getOrThrow<string>("modules.auth.database.name"),
                };

                await initializeDatabase(
                    options,
                    {
                        maxAttempts: 100,
                        intervalInMilliseconds: 5000,
                    },
                    logger
                );

                return {
                    ...options,
                    logging: true,
                    type: "postgres",
                    autoLoadEntities: true,
                    migrationsRun: true,
                    synchronize: false,
                    migrations: [InitDatabase1731437155592, ImplementOutbox1735337349949, ChangeTimestampsFormat1735340489564],
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
