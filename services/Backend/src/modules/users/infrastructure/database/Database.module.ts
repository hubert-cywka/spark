import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { initializeDatabase } from "@/common/utils/initializeDatabase";
import { logger } from "@/lib/logger";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants/connectionName";
import { InitDatabase1730555362764 } from "@/modules/users/infrastructure/database/migrations/1730555362764-InitDatabase";
import { AllowDuplicateEmails1731437638511 } from "@/modules/users/infrastructure/database/migrations/1731437638511-AllowDuplicateEmails";
import { ImplementOutbox1735337371158 } from "@/modules/users/infrastructure/database/migrations/1735337371158-ImplementOutbox";
import { ChangeTimestampsFormat1735340469452 } from "@/modules/users/infrastructure/database/migrations/1735340469452-ChangeTimestampsFormat";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            name: USERS_MODULE_DATA_SOURCE,
            useFactory: async (configService: ConfigService) => {
                const options = {
                    port: configService.getOrThrow<number>("modules.users.database.port"),
                    username: configService.getOrThrow<string>("modules.users.database.username"),
                    password: configService.getOrThrow<string>("modules.users.database.password"),
                    host: configService.getOrThrow<string>("modules.users.database.host"),
                    database: configService.getOrThrow<string>("modules.users.database.name"),
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
                    migrations: [
                        InitDatabase1730555362764,
                        AllowDuplicateEmails1731437638511,
                        ImplementOutbox1735337371158,
                        ChangeTimestampsFormat1735340469452,
                    ],
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
