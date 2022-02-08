const { defineConfig } = require("vite")
const { resolve } = require("path");
import manifestJSON from "./target/manifest.json";

const cssLink = manifestJSON["index.html"]["css"][0];
module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                parent: resolve(__dirname, "index.html"),
            },
        },
        outDir: "./target/parent",
        target: 'esnext',
        assetsInlineLimit: 0,
    },
    define: {
        cssFileName: cssLink.replace(/assets\//, ""),
    }
});
