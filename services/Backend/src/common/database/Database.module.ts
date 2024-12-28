import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { initializeDatabase } from "@/common/utils/initializeDatabase";
import { logger } from "@/lib/logger";

type DatabaseModuleOptions = {
    port: number;
    username: string;
    password: string;
    host: string;
    database: string;
    migrations: string[];
};

@Module({})
export class DatabaseModule {
    static forRootAsync(
        dataSource: string,
        entities: Function[], // eslint-disable-line @typescript-eslint/ban-types
        options: {
            useFactory: (...args: any[]) => DatabaseModuleOptions | Promise<DatabaseModuleOptions>; // eslint-disable-line @typescript-eslint/no-explicit-any
            inject?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
        }
    ): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    name: dataSource,
                    useFactory: async (...args: unknown[]) => {
                        const dbOptions = await options.useFactory(...args);

                        await initializeDatabase(
                            dbOptions,
                            {
                                maxAttempts: 100,
                                intervalInMilliseconds: 5000,
                            },
                            logger
                        );

                        return {
                            ...dbOptions,
                            type: "postgres",
                            logging: true,
                            autoLoadEntities: true,
                            migrationsRun: true,
                            synchronize: false,
                            migrations: dbOptions.migrations,
                        };
                    },
                    inject: options.inject || [],
                }),
                TypeOrmModule.forFeature(entities, dataSource),
            ],
        };
    }
}
