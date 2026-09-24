import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Plain Vite + React setup. No extra config needed.
export default defineConfig({
  plugins: [react()],
});
