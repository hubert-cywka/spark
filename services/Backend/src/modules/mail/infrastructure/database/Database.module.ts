import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { initializeDatabase } from "@/common/utils/initializeDatabase";
import { logger } from "@/lib/logger";
import { MAIL_MODULE_DATA_SOURCE } from "@/modules/mail/infrastructure/database/constants";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            name: MAIL_MODULE_DATA_SOURCE,
            useFactory: async (configService: ConfigService) => {
                const options = {
                    port: configService.getOrThrow<number>("modules.mail.database.port"),
                    username: configService.getOrThrow<string>("modules.mail.database.username"),
                    password: configService.getOrThrow<string>("modules.mail.database.password"),
                    host: configService.getOrThrow<string>("modules.mail.database.host"),
                    database: configService.getOrThrow<string>("modules.mail.database.name"),
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
