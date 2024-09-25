import { HttpExceptionsFilter, Logger, pinoLogger } from "@hcywka/common";
import { connectPubSub } from "@hcywka/pubsub";
import { ModuleWithHotReload } from "@hcywka/types";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import helmet from "helmet";

import { AppModule } from "@/App.module";
import configuration from "@/common/config/configuration";

declare const module: ModuleWithHotReload;

async function bootstrap() {
    const config = new ConfigService(configuration());
    const app = await NestFactory.create(AppModule, {
        logger: new Logger(pinoLogger, {}),
    });

    app.use(helmet());
    app.useLogger(app.get(Logger));
    app.useGlobalFilters(new HttpExceptionsFilter(app.get(HttpAdapterHost)));

    connectPubSub(app, {
        port: config.getOrThrow("pubsub.port"),
        host: config.getOrThrow("pubsub.host"),
    });

    await app.startAllMicroservices();
    await app.listen(config.getOrThrow("port"));

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
