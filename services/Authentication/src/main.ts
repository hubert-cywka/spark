import { ExceptionsFilter, Logger, pinoLogger } from "@hcywka/common";
import { connectPubSub } from "@hcywka/pubsub";
import { ModuleWithHotReload } from "@hcywka/types";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { AppModule } from "@/App.module";

declare const module: ModuleWithHotReload;

async function bootstrap() {
    const temporaryLogger = new Logger(pinoLogger, {});
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: temporaryLogger,
    });

    app.useLogger(app.get(Logger));
    app.useGlobalFilters(new ExceptionsFilter(app.get(HttpAdapterHost)));

    app.use(helmet());
    app.use(cookieParser());
    app.set("trust proxy", true);

    const config = new ConfigService();
    connectPubSub(app, {
        host: config.getOrThrow("pubsub.host"),
        port: config.getOrThrow("pubsub.port"),
    });
    await app.startAllMicroservices();
    await app.listen(config.getOrThrow("port"));

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

void bootstrap();
