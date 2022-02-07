const { defineConfig } = require('vite')
const { resolve } = require("path");

module.exports = defineConfig({
    build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'chatterbox.html'),
        parent: resolve(__dirname, 'index.html')
      }
        },
        outDir: "./target"
  },
});
