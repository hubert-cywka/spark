import { Application } from "@/app";
import { AppConfig } from "@/config/configuration";

const application = new Application(AppConfig());
await application.start();
