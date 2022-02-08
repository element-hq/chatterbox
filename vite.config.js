const { defineConfig } = require("vite");
const { resolve } = require("path");

module.exports = defineConfig(({ command }) => {
    if (command === "serve") {
        return {
            // dev specific config
            define: {
                CSS_FILE_NAME: JSON.stringify("parent-style.css"),
            },
        };
    } else {
        return {
            // build specific config
            build: {
                rollupOptions: {
                    input: {
                        main: resolve(__dirname, "chatterbox.html"),
                        parent: resolve(__dirname, "index.html"),
                    },
                },
                outDir: "./target",
                target: "esnext",
                assetsInlineLimit: 0,
                manifest: true,
            },
        };
    }
});
