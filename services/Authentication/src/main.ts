import { Logger, pinoLogger } from "@hcywka/common";
import { ModuleWithHotReload } from "@hcywka/types";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import helmet from "helmet";

import { AppModule } from "@/App.module";
import { ExceptionsFilter } from "@/common/filters/Exceptions.filter";
import configuration from "@/config/configuration";

declare const module: ModuleWithHotReload;

async function bootstrap() {
    const temporaryLogger = new Logger(pinoLogger, {});
    const app = await NestFactory.create(AppModule, {
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

bootstrap();
