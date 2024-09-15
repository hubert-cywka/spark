import { Logger, pinoLogger } from "@hcywka/nestjs-logger";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "@/app.module";
import configuration from "@/config/configuration";

declare const module: {
    hot: {
        accept: () => unknown;
        dispose: (callback: () => unknown) => unknown;
    };
};

async function bootstrap() {
    const temporaryLogger = new Logger(pinoLogger, {});
    const app = await NestFactory.create(AppModule, {
        logger: temporaryLogger,
    });
    app.useLogger(app.get(Logger));

    const appConfig = configuration();
    await app.listen(appConfig.port);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
