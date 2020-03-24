const merge = require('webpack-merge');
const { config: baseWebpackConfig, happyThreadPool } = require('./webpack.base.config');

// Helpers
const resolve = file => require('path').resolve(__dirname, file);

// Externals
const vueExternals = {
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue',
    root: 'Vue',
};

module.exports = merge(baseWebpackConfig, {
    entry: {
        app: './src/index.ts',
    },
    output: {
        path: resolve('../dist'),
        publicPath: '/dist/',
        library: 'Vugel',
        libraryTarget: 'umd',
        libraryExport: 'default',
        // See https://github.com/webpack/webpack/issues/6522
        globalObject: "typeof self !== 'undefined' ? self : this",
    },
    externals: {
        vue: { ...vueExternals },
        '@vue/runtime-core': { ...vueExternals },
        '@vue/compiler-core': { ...vueExternals },
        '@vue/reactivity': { ...vueExternals },
    },
    module: {
        rules: [
            {
                test: /\.[jt]s$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
});
