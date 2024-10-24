import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

dotenv.config();

const VITE_PORT = Number(process.env.VITE_PORT!);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        base: "/",
        define: {
            "process.env": {},
            __APP_ENV__: JSON.stringify(env.APP_ENV),
        },
        server: {
            port: VITE_PORT,
            hmr: {
                port: VITE_PORT,
            },
        },
        plugins: [react(), tsConfigPaths()],
    };
});
