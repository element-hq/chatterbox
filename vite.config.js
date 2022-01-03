const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/main.ts"),
            name: "chatterbox",
            fileName: "chatterbox.js",
        },
    },
    server: {
        fs: {
            // Allow serving files from hydrogen-web/target (for fonts and images)
            allow: ["../hydrogen-web/target", "."],
        },
    },
});
