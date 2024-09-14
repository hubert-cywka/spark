import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DatabaseConfigService } from "@/database/databaseConfig.service";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (databaseConfigService: DatabaseConfigService) => {
                await databaseConfigService.initDatabase();
                return databaseConfigService.createTypeOrmOptions();
            },
            inject: [DatabaseConfigService],
            extraProviders: [DatabaseConfigService],
        }),
    ],
})
export class DatabaseModule {}
