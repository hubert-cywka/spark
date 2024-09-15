import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { Logger, PinoLogger } from "nestjs-pino";

import { AppModule } from "@/app.module";
import configuration from "@/config/configuration";

declare const module: {
    hot: {
        accept: () => unknown;
        dispose: (callback: () => unknown) => unknown;
    };
};

async function bootstrap() {
    const logger = new PinoLogger({});
    const app = await NestFactory.create(AppModule, {
        logger: new Logger(logger, { renameContext: "AppInitialization" }),
    });
    app.useLogger(app.get(Logger));
    app.use(helmet());

    const appConfig = configuration();
    await app.listen(appConfig.port);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
