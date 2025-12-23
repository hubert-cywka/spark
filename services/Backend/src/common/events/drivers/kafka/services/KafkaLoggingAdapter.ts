import { Logger } from "@nestjs/common";
import { LogEntry, logLevel } from "kafkajs";

type KafkaLogLevelLabel = "INFO" | "ERROR" | "WARN" | "DEBUG" | "NOTHING";

export class KafkaLoggerAdapter {
    public constructor(private readonly logger: Logger) {}

    // Level is often incorrect, that's why we use entry.label instead
    public log(level: logLevel, entry: LogEntry) {
        this.logSeverity(entry.label as KafkaLogLevelLabel, { timestamp: entry.log.timestamp }, entry.log.message);
    }

    private logSeverity(label: KafkaLogLevelLabel, context: object, message: string) {
        switch (label) {
            case "DEBUG":
                return this.logger.debug(context, message);
            case "INFO":
                return this.logger.log(context, message);
            case "WARN":
                return this.logger.warn(context, message);
            case "ERROR":
            case "NOTHING":
                return this.logger.error(context, message);
        }
    }
}
