import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addTransactionalDataSource, getDataSourceByName } from "typeorm-transactional";

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
        connectionName: string,
        options: {
            useFactory: UseFactory<DatabaseModuleOptions>;
            inject?: UseFactoryArgs;
        }
    ): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    name: connectionName,
                    async dataSourceFactory(options) {
                        if (!options) {
                            throw new Error();
                        }

                        const existing = getDataSourceByName(connectionName);

                        if (existing) {
                            return existing;
                        }

                        return addTransactionalDataSource({
                            name: connectionName,
                            dataSource: new DataSource(options),
                        });
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
                            name: connectionName,
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
            ],
            exports: [TypeOrmModule],
        };
    }

    static forFeature(connectionName: string, entities: EntityConstructor[]): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [TypeOrmModule.forFeature(entities, connectionName)],
            exports: [TypeOrmModule],
        };
    }
}
