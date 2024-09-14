import { LoggerService } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Client } from "pg";

import { pollResourceUntilReady } from "./pollResourceUntilReady";

type DBConnectionOptions = {
    port: number;
    host: string;
    username: string;
    password: string;
    database: string;
};

export async function initPostgresDatabase(
    options: DBConnectionOptions,
    logger: LoggerService
): Promise<TypeOrmModuleOptions> {
    await ensureDatabaseExists(options, logger);

    return {
        type: "postgres",
        autoLoadEntities: true,
        synchronize: false,
        ...options,
    };
}

async function ensureDatabaseExists(options: DBConnectionOptions, logger: LoggerService): Promise<void> {
    const client = new Client(options);

    await pollResourceUntilReady({
        pollingFn: async () => {
            await client.connect();
            return true;
        },
        resourceName: `Database @ ${options.host}:${options.port}`,
        maxAttempts: 100,
        intervalInMilliseconds: 3000,
        logger,
    });

    const { database } = options;
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [database]);

    if (res.rowCount === 0) {
        logger.log("Database does not exist, creating...", { database });
        await client.query(`CREATE DATABASE ${options}`);
        logger.log("Database created.", { database });
    } else {
        logger.log("Database already exists.", { database });
    }

    await client.end();
}
