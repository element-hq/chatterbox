const { defineConfig } = require('vite')
const { resolve } = require("path");

module.exports = defineConfig({
    build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'chatterbox.html'),
        parent: resolve(__dirname, '/src/parent-style.css')
      }
        },
        outDir: "./build/chatterbox"
  },
    server: {
        fs: {
            // Allow serving files from hydrogen-web/target (for fonts and images)
            allow: ["../hydrogen-web/target", "."],
        },
    },
});
