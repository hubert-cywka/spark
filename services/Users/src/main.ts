import { Logger, pinoLogger } from "@hcywka/common";
import { ModuleWithHotReload } from "@hcywka/types";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";

import { AppModule } from "@/App.module";
import configuration from "@/config/configuration";

declare const module: ModuleWithHotReload;

async function bootstrap() {
    const temporaryLogger = new Logger(pinoLogger, {});
    const app = await NestFactory.create(AppModule, {
        logger: temporaryLogger,
    });

    app.use(helmet());
    app.useLogger(app.get(Logger));

    const appConfig = configuration();
    await app.listen(appConfig.port);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
