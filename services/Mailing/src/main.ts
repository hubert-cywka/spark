import { Logger, pinoLogger } from "@hcywka/common";
import { connectPubSub } from "@hcywka/pubsub";
import { ModuleWithHotReload } from "@hcywka/types";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "@/App.module";
import configuration from "@/config/configuration";

declare const module: ModuleWithHotReload;

async function bootstrap() {
    const config = new ConfigService(configuration());
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: new Logger(pinoLogger, {}),
    });

    app.useLogger(app.get(Logger));

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
