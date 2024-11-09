import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { initializeDatabase } from "@/common/utils/initializeDatabase";
import { logger } from "@/lib/logger";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants/connectionName";
import { InitMigration1731161534071 } from "@/modules/identity/infrastructure/database/migrations/1731161534071-InitMigration";
import { TermsAndConditionsTimestamp1731171265286 } from "@/modules/identity/infrastructure/database/migrations/1731171265286-TermsAndConditionsTimestamp";

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
                    migrations: [InitMigration1731161534071, TermsAndConditionsTimestamp1731171265286],
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
