import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   server: {
      proxy: {
         '/api': {
            target: 'https://mern-stack-twitter-clone-backend.vercel.app',
            changeOrigin: true,
            secure: true,
         },
      },
   },
});
