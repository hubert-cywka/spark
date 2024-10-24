import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { Logger } from "nestjs-pino";

import { AppModule } from "@/App.module";
import { logger } from "@/common/logger/logger";
import { connectPubSub } from "@/common/pubsub";
import { AppConfig } from "@/config/configuration";
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

    connectPubSub(app, {
        host: config.getOrThrow<string>("pubsub.host"),
        port: config.getOrThrow<number>("pubsub.port"),
    });

    await app.startAllMicroservices();
    await app.listen(config.getOrThrow<number>("port"));

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

void bootstrap();
