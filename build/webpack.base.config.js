require("dotenv").config();

const os = require("os");
const HappyPack = require("happypack");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";
const extractCSS = isProd || process.env.TARGET === "development";

exports.happyThreadPool = HappyPack.ThreadPool({
    size: Math.min(os.cpus().length, 4),
});

const plugins = [
    new FriendlyErrorsWebpackPlugin({
        clearConsole: true,
    }),
];

exports.config = {
    mode: isProd ? "production" : "development",
    resolve: {
        extensions: ["*", ".js", ".json", ".vue", ".ts"],
    },
    node: {
        fs: "empty",
    },
    plugins,
    performance: {
        hints: false,
    },
    stats: { children: false },
};
