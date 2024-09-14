import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Client } from "pg";

import { pollResourceUntilReady } from "@/utils/pollResourceUntilReady";

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    public createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: "postgres",
            autoLoadEntities: true,
            synchronize: false,
            ...this.getDbConnectionOptions(),
        };
    }

    public async initDatabase() {
        const options = this.getDbConnectionOptions();

        const client = new Client({
            host: options.host,
            user: options.username,
            password: options.password,
            port: options.port,
            database: "postgres",
        });

        await pollResourceUntilReady({
            pollingFn: async () => {
                await client.connect();
                return true;
            },
            resourceName: "database connection",
            maxAttempts: 100,
            intervalInMilliseconds: 3000,
        });

        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [options.database]);

        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE ${options.database}`);
        }

        await client.end();
    }

    private getDbConnectionOptions() {
        return {
            host: this.configService.get("database.host"),
            port: this.configService.get("database.port"),
            username: this.configService.get("database.username"),
            password: this.configService.get("database.password"),
            database: this.configService.get("database.name"),
        };
    }
}
