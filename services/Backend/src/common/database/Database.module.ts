import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addTransactionalDataSource } from "typeorm-transactional";

import { initializeDatabase } from "@/common/utils/initializeDatabase";
import { logger } from "@/lib/logger";
import { EntityConstructor, MigrationConstructor } from "@/types/Database";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

type DatabaseModuleOptions = {
    port: number;
    username: string;
    password: string;
    host: string;
    database: string;
    migrations: MigrationConstructor[];
    logging?: boolean;
};

@Module({})
export class DatabaseModule {
    static forRootAsync(
        dataSource: string,
        entities: EntityConstructor[],
        options: {
            useFactory: UseFactory<DatabaseModuleOptions>;
            inject?: UseFactoryArgs;
        }
    ): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    name: dataSource,
                    async dataSourceFactory(options) {
                        if (!options) {
                            throw new Error();
                        }

                        return addTransactionalDataSource(new DataSource(options));
                    },
                    useFactory: async (...args: UseFactoryArgs) => {
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
                            name: dataSource,
                            type: "postgres",
                            logging: dbOptions.logging,
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
            exports: [TypeOrmModule],
        };
    }
}
