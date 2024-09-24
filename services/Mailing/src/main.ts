import { ExceptionsFilter, Logger, pinoLogger } from "@hcywka/common";
import { ModuleWithHotReload } from "@hcywka/types";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";

import { AppModule } from "@/App.module";
import configuration from "@/config/configuration";

declare const module: ModuleWithHotReload;

async function bootstrap() {
    const temporaryLogger = new Logger(pinoLogger, {});
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: temporaryLogger,
    });

    app.useLogger(app.get(Logger));
    app.useGlobalFilters(new ExceptionsFilter(app.get(HttpAdapterHost)));

    app.use(helmet());

    const appConfig = configuration();
    await app.listen(appConfig.port);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

void bootstrap();
