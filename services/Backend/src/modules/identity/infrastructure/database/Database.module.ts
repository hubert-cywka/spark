import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { initializeDatabase } from "@/common/utils/initializeDatabase";
import { logger } from "@/lib/logger";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants/connectionName";
import { RenameEntities1731233063970 } from "@/modules/identity/infrastructure/database/migrations/1731233063970-RenameEntities";

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
                    type: "postgres",
                    autoLoadEntities: true,
                    migrationsRun: true,
                    synchronize: false,
                    migrations: [RenameEntities1731233063970],
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
