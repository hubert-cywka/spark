export const AlertsProcessorToken = Symbol("AlertsProcessor");

export interface IAlertsProcessor {
    triggerPendingAlerts(): Promise<void>;
}
