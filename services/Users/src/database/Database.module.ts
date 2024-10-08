import { Logger, pinoLogger } from "@hcywka/common";
import { initializePostgresDatabase } from "@hcywka/database";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AddUserTable1727272270150 } from "@/database/migrations/1727272270150-AddUserTable";
import { AddFirstAndLastNameFieldsToUser1728058199103 } from "@/database/migrations/1728058199103-AddFirstAndLastNameFieldsToUser";

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
                    synchronize: false,
                    migrations: [AddUserTable1727272270150, AddFirstAndLastNameFieldsToUser1728058199103],
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
