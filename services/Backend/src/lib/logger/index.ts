import { type Params, Logger, PinoLogger } from "nestjs-pino";

export const loggerOptions: Params["pinoHttp"] = {
    transport: { target: "pino-pretty" },
};
export const pinoLogger = new PinoLogger({ pinoHttp: loggerOptions });

export const logger = new Logger(pinoLogger, {});
