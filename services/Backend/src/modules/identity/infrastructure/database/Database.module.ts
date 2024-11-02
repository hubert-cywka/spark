import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { initializeDatabase } from "@/common/utils/initializeDatabase";
import { logger } from "@/lib/logger";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants/connectionName";
import { InitMigration1730484788849 } from "@/modules/identity/infrastructure/database/migrations/1730484788849-InitMigration";
import { HashRefreshTokens1730541294391 } from "@/modules/identity/infrastructure/database/migrations/1730541294391-HashRefreshTokens";

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
                    migrations: [InitMigration1730484788849, HashRefreshTokens1730541294391],
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
