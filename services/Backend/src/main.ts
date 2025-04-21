import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import { Logger } from "nestjs-pino";

import { AppModule } from "@/App.module";
import { AppConfig } from "@/config/configuration";
import { logger } from "@/lib/logger";

dayjs.extend(utc);
dayjs.extend(timezone);

process.on("uncaughtException", (error) => {
    logger.fatal({ error }, "Uncaught exception.");
});

process.on("unhandledRejection", (error) => {
    logger.fatal({ error }, "Unhandled rejection");
});

async function bootstrap() {
    const config = new ConfigService(AppConfig());
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger,
    });

    const appLogger = app.get(Logger);
    app.useLogger(appLogger);
    app.setGlobalPrefix("api");
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        })
    );

    app.use(cookieParser(config.getOrThrow<string>("cookies.secret")));
    app.set("trust proxy", true);

    // TODO: Update schemas and responses for each endpoint
    const swaggerConfig = new DocumentBuilder().setTitle("codename - OpenAPI").setVersion("1.0").addTag("codename").build();
    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("documentation", app, documentFactory, {
        useGlobalPrefix: true,
    });

    await app.startAllMicroservices();
    await app.listen(config.getOrThrow<number>("port"));
}

void bootstrap();
