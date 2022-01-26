const { defineConfig } = require('vite')

module.exports = defineConfig({
    server: {
        fs: {
            // Allow serving files from hydrogen-web/target (for fonts and images)
            allow: ["../hydrogen-web/target", "."],
        },
    },
});
