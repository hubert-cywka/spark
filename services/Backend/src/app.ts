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
import { disableEventLoopMonitor, enableEventLoopMonitor } from "@/common/observability/monitors/eventLoopMonitorHook";
import { logger } from "@/lib/logger";

dayjs.extend(utc);
dayjs.extend(timezone);

export class Application {
    private readonly config: ConfigService;
    private logger: Logger;
    private app: NestFastifyApplication | null = null;

    private isShuttingDown: boolean = false;

    public constructor(configurationMap: object) {
        initializeTransactionalContext();
        this.config = new ConfigService(configurationMap);
        this.logger = logger;
    }

    public async start() {
        this.app = await NestFactory.create<NestFastifyApplication>(
            AppModule,
            new FastifyAdapter({
                trustProxy: true,
            }),
            {
                logger: this.logger,
            }
        );

        await this.app.register(fastifyCookie, {
            secret: this.config.getOrThrow<string>("cookies.secret"),
        });

        this.logger = this.app.get(Logger);
        this.app.useLogger(this.logger);
        this.app.setGlobalPrefix("api");
        this.app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
            })
        );

        this.addSwagger();
        this.enableGracefulShutdown();
        this.enableMonitoring();

        await this.app.startAllMicroservices();
        await this.app.listen(this.config.getOrThrow<number>("port"), "0.0.0.0", (err, address) => {
            if (err) {
                this.logger.fatal("Startup failed.");
            } else {
                this.logger.log({ address }, "Listening.");
            }
        });
    }

    private getApp() {
        if (!this.app) {
            throw new Error("App was not initialized properly.");
        }

        return this.app;
    }

    private addSwagger() {
        // TODO: Update schemas and responses for each endpoint
        const swaggerConfig = new DocumentBuilder().setTitle("codename - OpenAPI").setVersion("1.0").addTag("codename").build();
        const documentFactory = () => SwaggerModule.createDocument(this.getApp(), swaggerConfig);
        SwaggerModule.setup("documentation", this.getApp(), documentFactory, {
            useGlobalPrefix: true,
        });
    }

    private enableGracefulShutdown() {
        // We could call app.enableShutdownHooks(), we get more control over the shutdown process if we just handle
        // it manually (while still calling app.close() to properly handle lifecycle events).
        const signals = ["SIGTERM", "SIGINT"];

        signals.forEach((signal) => {
            process.on(signal, async () => {
                await this.terminate(signal);
            });
        });

        process.on("uncaughtException", async (error) => {
            await this.terminate("uncaughtException", error);
        });

        process.on("unhandledRejection", async (reason) => {
            const error = reason instanceof Error ? reason : new Error(`Unhandled rejection: ${reason}`);
            await this.terminate("unhandledRejection", error);
        });
    }

    private async terminate(signal: string, error?: Error | string) {
        if (this.isShuttingDown) {
            this.logger.warn(error, `Process received ${signal}. Already shutting down.`);
            return;
        }

        this.isShuttingDown = true;
        this.logger.error(error, `Process received ${signal}. Initiating graceful shutdown.`);

        try {
            await this.getApp().close();
            this.disableMonitoring();
            this.logger.log("NestJS application closed gracefully.");
            process.exitCode = 0;
        } catch (cleanupError) {
            this.logger.error(cleanupError, "Error during NestJS application closure.");
            process.exitCode = 1;
        }

        // Do not call process.exit(), there is no need to -> https://nodejs.org/api/process.html#processexitcode
    }

    private enableMonitoring() {
        if (this.config.get<boolean>("observability.enableEventLoopMonitoring")) {
            enableEventLoopMonitor();
            this.logger.log("Event loop monitoring enabled.");
        }
    }

    private disableMonitoring() {
        disableEventLoopMonitor();
    }
}
