import fastifyCookie from "@fastify/cookie";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import { Logger } from "nestjs-pino";
import { initializeTransactionalContext } from "typeorm-transactional";

import { AppModule } from "@/App.module";
import { AppConfig } from "@/config/configuration";
import { logger } from "@/lib/logger";

dayjs.extend(utc);
dayjs.extend(timezone);

process.on("uncaughtException", (error) => {
    logger.fatal(error, "Uncaught exception.");
    process.exit(1);
});

process.on("unhandledRejection", (error) => {
    logger.fatal(error, "Unhandled rejection");
    process.exit(1);
});

async function bootstrap() {
    initializeTransactionalContext();

    const config = new ConfigService(AppConfig());
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            trustProxy: true,
        }),
        {
            logger,
        }
    );

    const appLogger = app.get(Logger);
    app.useLogger(appLogger);
    app.setGlobalPrefix("api");
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        })
    );

    await app.register(fastifyCookie, {
        secret: config.getOrThrow<string>("cookies.secret"),
    });

    // TODO: Update schemas and responses for each endpoint
    const swaggerConfig = new DocumentBuilder().setTitle("codename - OpenAPI").setVersion("1.0").addTag("codename").build();
    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("documentation", app, documentFactory, {
        useGlobalPrefix: true,
    });

    app.enableShutdownHooks();
    await app.startAllMicroservices();
    await app.listen(config.getOrThrow<number>("port"), (err, address) => {
        if (err) {
            appLogger.fatal("Startup failed.");
        } else {
            appLogger.log({ address }, "Started listening.");
        }
    });
}

void bootstrap();
