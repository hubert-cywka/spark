import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { responseHeaders } from "../common/config/responseHeaders";

export default defineConfig({
  server: {
    headers: responseHeaders,
  },
  plugins: [react()],
})
