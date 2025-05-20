import { DynamicModule, ForwardReference, Type } from "@nestjs/common";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModuleImport = DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>;
