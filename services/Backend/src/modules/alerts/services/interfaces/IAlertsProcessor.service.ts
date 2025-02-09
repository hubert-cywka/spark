export const AlertsProcessorServiceToken = Symbol("AlertsProcessorService");

export interface IAlertsProcessorService {
    triggerPendingAlerts(): Promise<void>;
}
