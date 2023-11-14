import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Svgr from 'vite-plugin-svgr';
export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react({jsxRuntime:'classic'}),
    Svgr({svgrOptions:{icon:true}})
    ],
    server:{
      proxy:"http://localhost:5000"
    },
    
  };
});