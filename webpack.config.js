const vueExternals = {
    commonjs: "vue",
    commonjs2: "vue",
    amd: "vue",
    root: "Vue",
};

module.exports = require("@planning.nl/webpack-config")({
    entry: {
        vugel: "./src/index.ts",
    },
    externals: {
        vue: { ...vueExternals },
        "@vue/runtime-core": { ...vueExternals },
        "@vue/compiler-core": { ...vueExternals },
        "@vue/reactivity": { ...vueExternals },
    },
});
