import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { Logger } from "nestjs-pino";

import { AppModule } from "@/app.module";
import configuration from "@/config/configuration";

declare const module: {
    hot: {
        accept: () => unknown;
        dispose: (callback: () => unknown) => unknown;
    };
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
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
