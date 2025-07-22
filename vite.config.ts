import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import detect from 'detect-port';

const DEFAULT_PORT = 5173;

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const port = await detect(DEFAULT_PORT);

  // if (port !== DEFAULT_PORT) {
  //   console.log(`⚠️ Puerto ${DEFAULT_PORT} en uso. Usando puerto alternativo: ${port}`);
  // }

  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    server: {
      port,
      open: true,
    },
  };
});
