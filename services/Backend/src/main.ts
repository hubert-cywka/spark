import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { CustomStrategy } from "@nestjs/microservices";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NatsJetStreamServer } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import cookieParser from "cookie-parser";
import { Logger } from "nestjs-pino";

import { AppModule } from "@/App.module";
import { IntegrationEventTopics } from "@/common/events";
import { AppConfig } from "@/config/configuration";
import { logger } from "@/lib/logger";

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

    await app
        .connectMicroservice<CustomStrategy>({
            strategy: new NatsJetStreamServer({
                connectionOptions: {
                    servers: `${config.getOrThrow<string>("pubsub.host")}:${config.getOrThrow<number>("pubsub.port")}`,
                    name: "codename-listener",
                },
                consumerOptions: {
                    deliverGroup: "codename-group",
                    durable: "codename-durable",
                    deliverTo: "codename-messages",
                    manualAck: true,
                },
                streamConfig: [
                    {
                        name: "account",
                        subjects: [IntegrationEventTopics.account.all],
                    },
                    {
                        name: "alert",
                        subjects: [IntegrationEventTopics.alert.all],
                    },
                    {
                        name: "2fa",
                        subjects: [IntegrationEventTopics.twoFactorAuth.all],
                    },
                ],
            }),
        })
        .listen();

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
