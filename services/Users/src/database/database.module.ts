import { initPostgresDatabase } from "@hcywka/nestjs-database-utils";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                const options = {
                    port: configService.get("database.port"),
                    user: configService.get("database.user"),
                    password: configService.get("database.password"),
                    host: configService.get("database.host"),
                    database: configService.get("database.port"),
                };

                return await initPostgresDatabase(options);
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
