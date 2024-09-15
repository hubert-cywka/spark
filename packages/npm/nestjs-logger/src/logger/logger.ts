import { Logger, PinoLogger } from "nestjs-pino";

const logger = new PinoLogger({ pinoHttp: {} });
export const CustomLogger = new Logger(logger, {});
