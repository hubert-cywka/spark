import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    server: {},
    plugins: [react(), tsConfigPaths()],
});
