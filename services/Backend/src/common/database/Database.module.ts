import { DynamicModule, Module } from "@nestjs/common";
import { getDataSourceToken, TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addTransactionalDataSource, getDataSourceByName } from "typeorm-transactional";

import { DatabaseLockService } from "@/common/database/services/DatabaseLockService";
import { DatabaseLockServiceToken } from "@/common/database/services/IDatabaseLockService";
import { initializeDatabase } from "@/common/utils/databaseUtils";
import { EntityConstructor, MigrationConstructor } from "@/types/Database";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const CONNECTION_INITIALIZATION_MAX_ATTEMPTS = 15;
const CONNECTION_INITIALIZATION_BASE_INTERVAL = 1_000;

type DatabaseModuleOptions = {
    port: number;
    username: string;
    password: string;
    host: string;
    database: string;
    synchronize?: boolean;
    migrations?: MigrationConstructor[];
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

                        await initializeDatabase(dbOptions, {
                            maxAttempts: CONNECTION_INITIALIZATION_MAX_ATTEMPTS,
                            baseInterval: CONNECTION_INITIALIZATION_BASE_INTERVAL,
                        });

                        return {
                            ...dbOptions,
                            name: connectionName,
                            type: "postgres",
                            logging: dbOptions.logging,
                            autoLoadEntities: true,
                            migrationsRun: true,
                            synchronize: dbOptions.synchronize,
                            migrations: dbOptions.migrations,
                        };
                    },
                    inject: options.inject || [],
                }),
            ],
            providers: [
                {
                    provide: DatabaseLockServiceToken,
                    useFactory: (dataSource: DataSource) => new DatabaseLockService(dataSource, connectionName),
                    inject: [getDataSourceToken(connectionName)],
                },
            ],
            exports: [TypeOrmModule, DatabaseLockServiceToken],
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
