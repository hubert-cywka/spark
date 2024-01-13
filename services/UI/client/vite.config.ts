import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"


export default defineConfig({
  server: {
    headers: {
      "Content-Security-Policy": "default-src: self",
      "Referrer-Policy": "no-referrer"
    },
  },
  plugins: [react()],
})
