import { DynamicModule, Module } from "@nestjs/common";
import { getDataSourceToken, TypeOrmModule } from "@nestjs/typeorm";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { ClsModule } from "nestjs-cls";

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
                            logging: false,
                            autoLoadEntities: true,
                            migrationsRun: true,
                            synchronize: false,
                            migrations: dbOptions.migrations,
                        };
                    },
                    inject: options.inject || [],
                }),

                TypeOrmModule.forFeature(entities, dataSource),

                ClsModule.forRoot({
                    middleware: {
                        mount: true,
                    },
                    plugins: [
                        new ClsPluginTransactional({
                            connectionName: dataSource,
                            adapter: new TransactionalAdapterTypeOrm({
                                dataSourceToken: getDataSourceToken(dataSource),
                            }),
                        }),
                    ],
                }),
            ],
        };
    }
}
