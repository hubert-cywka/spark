import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { RedisOptions } from "@nestjs/microservices";
import { Transport } from "@nestjs/microservices";
import type { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { Logger } from "nestjs-pino";

import { AppModule } from "@/App.module";
import { AppConfig } from "@/config/configuration";
import { logger } from "@/lib/logger";

async function bootstrap() {
    const config = new ConfigService(AppConfig());
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger,
    });

    app.useLogger(app.get(Logger));

    app.use(cookieParser(config.getOrThrow<string>("cookies.secret")));
    app.set("trust proxy", true);

    app.connectMicroservice<RedisOptions>({
        transport: Transport.REDIS,
        options: {
            host: config.getOrThrow<string>("pubsub.host"),
            port: config.getOrThrow<number>("pubsub.port"),
        },
    });

    await app.startAllMicroservices();
    await app.listen(config.getOrThrow<number>("port"));
}

void bootstrap();
