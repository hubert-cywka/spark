import { type Params, Logger, PinoLogger } from "nestjs-pino";

export const loggerOptions: Params["pinoHttp"] = {
    level: "silent",
    transport: {
        target: "pino-pretty",
        options: {
            singleLine: true,
        },
    },
    redact: {
        paths: ["req.headers.authorization", "req.headers.cookie", 'res.headers["set-cookie"]'],
        censor: "***REDACTED***",
    },
};
export const pinoLogger = new PinoLogger({ pinoHttp: loggerOptions });

export const logger = new Logger(pinoLogger, {});
