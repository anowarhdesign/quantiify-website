import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The site is served from https://anowarhdesign.github.io/quantiify-website/.
// When it moves to its own domain, build with BASE_PATH=/ and VITE_SITE_URL=https://your.domain/
const base = process.env.BASE_PATH || '/quantiify-website/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    // hashed JS/CSS go to static/, so they never mix with the images in public/assets/
    assetsDir: 'static',
  },
});
