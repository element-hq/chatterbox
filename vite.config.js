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

            // The default base is "/", which results in absolute links being generated, e.g. /assets/foo.js.
            // However, we want to be able to serve chatterbox from a directory which isn't the server's root.
            // By setting base to an empty string, relative links are generated, e.g. assets/foo.js.
            base: "",
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
