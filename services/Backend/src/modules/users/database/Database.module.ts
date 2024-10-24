import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { logger } from "@/common/logger/logger";
import { initializePostgresDatabase } from "@/common/utils/initializePostgresDatabase";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                const options = {
                    port: configService.getOrThrow<number>("modules.users.database.port"),
                    username: configService.getOrThrow<string>("modules.users.database.username"),
                    password: configService.getOrThrow<string>("modules.users.database.password"),
                    host: configService.getOrThrow<string>("modules.users.database.host"),
                    database: configService.getOrThrow<string>("modules.users.database.name"),
                };

                await initializePostgresDatabase(
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
                    migrations: [],
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
