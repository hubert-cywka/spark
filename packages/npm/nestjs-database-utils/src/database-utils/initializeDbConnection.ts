import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Client } from "pg";

import { logger } from "./logger";
import { pollResourceUntilReady } from "./pollResourceUntilReady";

type DBConnectionOptions = {
    port: number;
    host: string;
    username: string;
    password: string;
    database: string;
};

export async function initPostgresDatabase(options: DBConnectionOptions): Promise<TypeOrmModuleOptions> {
    await ensureDatabaseExists(options);

    return {
        type: "postgres",
        autoLoadEntities: true,
        synchronize: false,
        ...options,
    };
}

async function ensureDatabaseExists(options: DBConnectionOptions): Promise<void> {
    let client = createClient(options);

    await pollResourceUntilReady({
        pollingFn: async () => {
            try {
                await client.connect();
            } catch (e) {
                await client.end();
                client = createClient(options);
                throw e;
            }
            return true;
        },
        resourceName: `Database @ ${options.host}:${options.port}`,
        maxAttempts: 100,
        intervalInMilliseconds: 3000,
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

function createClient(options: DBConnectionOptions): Client {
    return new Client({
        database: "postgres",
        password: options.password,
        host: options.host,
        user: options.username,
        port: options.port,
    });
}
