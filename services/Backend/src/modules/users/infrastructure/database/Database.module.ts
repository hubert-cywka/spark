import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { initializeDatabase } from "@/common/utils/initializeDatabase";
import { logger } from "@/lib/logger";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants";

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
                    migrations: [],
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
