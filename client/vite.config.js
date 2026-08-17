import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Svgr from 'vite-plugin-svgr';
// Path prefixes mounted by the Express API in server.js. In production the SPA is
// served from that same origin, so these only need proxying during local dev.
const API_ROUTES = [
  '/register',
  '/items',
  '/cart',
  '/auth',
  '/categories',
  '/checkout',
  '/orders',
  '/reviews',
];
export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react({jsxRuntime:'classic'}),
    Svgr({svgrOptions:{icon:true}})
    ],
    server:{
      proxy: Object.fromEntries(
        API_ROUTES.map(route => [route, 'http://localhost:3000'])
      ),
    },
    
  };
});