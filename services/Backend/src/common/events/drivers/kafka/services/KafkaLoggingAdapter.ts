import { Logger } from "@nestjs/common";
import { LogEntry, logLevel } from "kafkajs";

export class KafkaLoggerAdapter {
    public constructor(private readonly logger: Logger) {}

    public log(level: logLevel, entry: LogEntry) {
        this.logSeverity(level, { timestamp: entry.log.timestamp, label: entry.label }, entry.log.message);
    }

    private logSeverity(level: logLevel, context: object, message: string) {
        switch (level) {
            case logLevel.INFO:
                return this.logger.log(context, message);
            case logLevel.WARN:
                return this.logger.warn(context, message);
            case logLevel.ERROR:
                return this.logger.error(context, message);
            case logLevel.DEBUG:
                return this.logger.debug(context, message);
            case logLevel.NOTHING:
                return this.logger.verbose(context, message);
        }
    }
}
