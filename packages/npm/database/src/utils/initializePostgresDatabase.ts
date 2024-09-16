import { pollResourceUntilReady } from "@hcywka/common";
import { LoggerService } from "@nestjs/common";
import { Client } from "pg";

type DBConnectionOptions = {
    port: number;
    host: string;
    username: string;
    password: string;
    database: string;
};

type RetryOptions = {
    maxAttempts: number;
    intervalInMilliseconds: number;
};

export async function initializePostgresDatabase(
    dbOptions: DBConnectionOptions,
    { maxAttempts = 100, intervalInMilliseconds = 3000 }: RetryOptions,
    logger?: LoggerService
): Promise<void> {
    let client = createClient(dbOptions);
    const { database, host, port } = dbOptions;

    await pollResourceUntilReady({
        pollingFn: async () => {
            try {
                await client.connect();
            } catch (e) {
                await client.end();
                client = createClient(dbOptions);
                throw e;
            }
            return true;
        },
        resourceName: `Database @ ${host}:${port}`,
        maxAttempts,
        intervalInMilliseconds,
    });

    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [database]);

    if (res.rowCount === 0) {
        logger?.log("Database does not exist, creating...", { database });
        await client.query(`CREATE DATABASE ${database}`);
        logger?.log("Database created.", { database });
    } else {
        logger?.log("Database already exists.", { database });
    }

    await client.end();
}

function createClient({ password, host, username, port }: DBConnectionOptions): Client {
    return new Client({
        database: "postgres",
        user: username,
        password,
        host,
        port,
    });
}
