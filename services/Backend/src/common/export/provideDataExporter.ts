import { Provider } from "@nestjs/common";

import { IntegrationEvents } from "@/common/events";
import { DataExportCancelledEventHandler } from "@/common/export/events/DataExportCancelledEvent.handler";
import { DataExportStartedEventHandler } from "@/common/export/events/DataExportStartedEvent.handler";
import { DataExporter } from "@/common/export/services/DataExporter";
import { DataExporterToken } from "@/common/export/services/IDataExporter";
import { type IDataExportProvider, DataExportProvidersToken } from "@/common/export/services/IDataExportProvider";
import { UseFactoryArgs } from "@/types/UseFactory";

// TODO: This does not feel right. Importing it from a shared module would be more natural but requires more work to
//  resolve dependencies.
export const provideDataExporter = (dataExportProviders: UseFactoryArgs): Provider[] => [
    {
        provide: DataExporterToken,
        useClass: DataExporter,
    },
    {
        provide: DataExportStartedEventHandler,
        useClass: DataExportStartedEventHandler,
    },
    {
        provide: DataExportProvidersToken,
        useFactory: (...providers: IDataExportProvider[]) => providers,
        inject: dataExportProviders,
    },
];

export const getDataExportEventHandlers = () => [DataExportStartedEventHandler, DataExportCancelledEventHandler];

export const getDataExportEventTopics = () => [IntegrationEvents.export.started, IntegrationEvents.export.cancelled];
