var webpack = require("webpack")

module.exports = {
    context: __dirname,
    entry: "./index.js",
    output: {
        path: __dirname + "/build",
        filename: "raptor.js"
    },
    plugins: [
        new webpack.ProvidePlugin({})
    ],
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: "json-loader"
            },
        ]
    },
    node: {
        fs: "empty",
        net: "empty",
        tls: "empty"
    },
    devtool: "source-map"
}
