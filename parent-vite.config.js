/**
 * We do a second build for parent (the first one builds both parent and chatterbox-app) because we need
 * the link to the CSS file for parent with the asset-hash included.
 */
const { defineConfig } = require("vite")
const { resolve } = require("path");

// We've configured the first build to produce a manifest.json that tells us what the asset-hashed file names are.
import manifestJSON from "./target/manifest.json";

const cssLink = manifestJSON["index.html"]["css"][0];
module.exports = defineConfig({
    // The default base is "/", which results in absolute links being generated, e.g. /assets/foo.js.
    // However, we want to be able to serve chatterbox from a directory which isn't the server's root.
    // By setting base to an empty string, relative links are generated, e.g. assets/foo.js.
    base: "",
    build: {
        rollupOptions: {
            input: {
                parent: resolve(__dirname, "index.html"),
            },
            output: {
                entryFileNames: "assets/[name].js",
            },
        },
        outDir: "./target/parent",
        assetsInlineLimit: 0,
    },
    define: {
        CSS_FILE_NAME: cssLink.replace(/assets\//, ""),
    }
});
