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
      // NOTE: COOP is deliberately NOT set. useGoogleLogin opens a real popup and
      // needs a live window.opener; a same-origin* COOP severs it. Only the Sign In
      // With Google button / One Tap need COOP, and we use neither.
      // headers: { 'Cross-Origin-Opener-Policy': 'same-origin-allow-popups' },
      proxy: Object.fromEntries(
        API_ROUTES.map(route => [route, 'http://localhost:3000'])
      ),
    },
    
  };
});