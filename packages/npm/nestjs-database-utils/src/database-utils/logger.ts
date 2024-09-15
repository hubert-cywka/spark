import { PinoLogger } from "nestjs-pino";

export const logger = new PinoLogger({
    renameContext: "DatabaseInitialization",
});
