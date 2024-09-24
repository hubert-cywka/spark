import { Logger, pinoLogger } from "@hcywka/common";
import { initializePostgresDatabase } from "@hcywka/database";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { InitTables1726517504746 } from "@/database/migrations/1726517504746-InitTables";
import { AddActivationTokens1727179586288 } from "@/database/migrations/1727179586288-AddActivationTokens";
import { NullableActivationToken1727211365266 } from "@/database/migrations/1727211365266-NullableActivationToken";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                const options = {
                    port: configService.getOrThrow<number>("database.port"),
                    username: configService.getOrThrow<string>("database.username"),
                    password: configService.getOrThrow<string>("database.password"),
                    host: configService.getOrThrow<string>("database.host"),
                    database: configService.getOrThrow<string>("database.name"),
                };

                await initializePostgresDatabase(
                    options,
                    {
                        maxAttempts: 100,
                        intervalInMilliseconds: 5000,
                    },
                    new Logger(pinoLogger, {})
                );

                return {
                    ...options,
                    type: "postgres",
                    autoLoadEntities: true,
                    migrationsRun: true,
                    migrations: [
                        InitTables1726517504746,
                        AddActivationTokens1727179586288,
                        NullableActivationToken1727211365266,
                    ],
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
