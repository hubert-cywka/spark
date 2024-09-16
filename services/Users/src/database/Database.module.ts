import { Logger, pinoLogger } from "@hcywka/common";
import { initializePostgresDatabase } from "@hcywka/database";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

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
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
