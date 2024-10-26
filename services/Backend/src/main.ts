import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { RedisOptions, Transport } from "@nestjs/microservices";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { Logger } from "nestjs-pino";

import { AppModule } from "@/App.module";
import { AppConfig } from "@/config/configuration";
import { logger } from "@/lib/logger";
import { ModuleWithHotReload } from "@/types/hmr";

declare const module: ModuleWithHotReload;

async function bootstrap() {
    const config = new ConfigService(AppConfig());
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger,
    });

    app.useLogger(app.get(Logger));

    app.use(cookieParser());
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

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

void bootstrap();
