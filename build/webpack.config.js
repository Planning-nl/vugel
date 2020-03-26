const webpack = require("webpack");
const merge = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");

const base = require("./webpack.prod.config");

const builds = {
    development: {
        config: {
            devtool: "source-map",
            mode: "development",
            output: {
                filename: "vugel.js",
                libraryTarget: "umd",
            },
        },
    },
    production: {
        config: {
            mode: "production",
            output: {
                filename: "vugel.min.js",
                libraryTarget: "umd",
            },
            performance: {
                hints: false,
            },
        },
        env: "production",
    },
};

function genConfig(opts) {
    const config = merge({}, base, opts.config);

    config.plugins = config.plugins.concat([
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(opts.env || "development"),
        }),
    ]);

    config.optimization = {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
        ],
    };

    return config;
}

module.exports = Object.keys(builds).map((name) => genConfig(builds[name]));
