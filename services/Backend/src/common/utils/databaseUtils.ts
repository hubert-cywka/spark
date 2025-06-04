import { Logger } from "@nestjs/common";
import pg from "pg";

import { LinearRetryBackoffPolicy } from "@/common/retry/LinearRetryBackoffPolicy";
import { withRetry } from "@/common/retry/withRetry";

export type DBConnectionOptions = {
    port: number;
    host: string;
    username: string;
    password: string;
    database: string;
};

type RetryOptions = {
    maxAttempts: number;
    baseInterval: number;
};

export async function initializeDatabase(dbOptions: DBConnectionOptions, retryOptions: RetryOptions): Promise<void> {
    const { database } = dbOptions;
    const client = createClient(dbOptions);
    const logger = new Logger(database);

    await assertConnection(client, logger, retryOptions);
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [database]);

    if (res.rowCount === 0) {
        logger.log("Database does not exist, creating...", { database });
        await client.query(`CREATE DATABASE ${database}`);
        logger.log("Database created.", { database });
    } else {
        logger.log("Database already exists.", { database });
    }

    await client.end();
}

export async function dropDatabase(dbOptions: DBConnectionOptions, database: string, retryOptions: RetryOptions): Promise<void> {
    const client = createClient(dbOptions);
    const logger = new Logger(database);

    await assertConnection(client, logger, retryOptions);
    await client.query(`DROP DATABASE ${database} WITH (FORCE)`);
    logger.log("Database dropped.", { database });

    await client.end();
}

function createClient({ password, host, username, port }: DBConnectionOptions): pg.Client {
    return new pg.Client({
        database: "postgres",
        user: username,
        password,
        host,
        port,
    });
}

async function assertConnection(client: pg.Client, logger: Logger, { baseInterval, maxAttempts }: RetryOptions) {
    const retryPolicy = new LinearRetryBackoffPolicy(baseInterval);

    await withRetry(
        async (attempt) => {
            logger.log({ attempt }, "Trying to connect to DB.");
            await client.connect();
        },
        {
            maxAttempts,
            retryPolicy,
            onSuccess: (attempt) => logger.log({ attempt }, "Connected to DB."),
            onFailure: (error) => logger.warn(error, "Failed to connect to DB."),
        }
    );
}
