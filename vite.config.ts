import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          categories: resolve(__dirname, 'categories.html'),
          product: resolve(__dirname, 'product.html'),
          cart: resolve(__dirname, 'cart.html'),
          wishlist: resolve(__dirname, 'wishlist.html'),
          account: resolve(__dirname, 'account.html'),
          checkout: resolve(__dirname, 'checkout.html'),
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
