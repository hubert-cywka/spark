export const AlertsProcessorServiceToken = Symbol("AlertsProcessorService");

export interface IAlertsProcessor {
    triggerPendingAlerts(): Promise<void>;
}
