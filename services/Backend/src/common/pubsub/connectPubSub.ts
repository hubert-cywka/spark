import { INestApplication } from "@nestjs/common";
import { RedisOptions, Transport } from "@nestjs/microservices";

import { PubSubConnectionOptions } from "./types";

export const connectPubSub = (app: INestApplication, { host, port }: PubSubConnectionOptions) => {
    app.connectMicroservice<RedisOptions>({
        transport: Transport.REDIS,
        options: {
            host,
            port,
        },
    });

    return app;
};
