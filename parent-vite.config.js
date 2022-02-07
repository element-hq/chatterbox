const { defineConfig } = require('vite')
const { resolve } = require("path");

module.exports = defineConfig({
    build: {
        outDir: "./build/parent",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "/src/parent.ts"),
                parent: resolve(__dirname, "/src/parent-style.css"),
            },
        },
    },
});

