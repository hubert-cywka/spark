import { initializePostgresDatabase } from "@hcywka/nestjs-database-utils";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { InitAuthTable1726435122759 } from "@/database/migrations/1726435122759-init-auth-table";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                const options = {
                    port: configService.get("database.port"),
                    username: configService.get("database.username"),
                    password: configService.get("database.password"),
                    host: configService.get("database.host"),
                    database: configService.get("database.name"),
                };

                await initializePostgresDatabase(options, {
                    maxAttempts: 100,
                    intervalInMilliseconds: 5000,
                });

                return {
                    ...options,
                    type: "postgres",
                    autoLoadEntities: true,
                    migrationsRun: true,
                    migrations: [InitAuthTable1726435122759],
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
