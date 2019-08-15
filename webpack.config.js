const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin')

let extractPlugin = new ExtractTextPlugin({
    filename: './bundle.styles.css'
})

module.exports = {
    context: path.resolve(__dirname, 'src'),
    // @TODO this is garbage. fetch and core-js add literally 500kb of bloat just to accommodate IE 11 and it still needs 'Symbols'. Garbage. Pure garbage
        // find a better solution
    entry: ['whatwg-fetch', 'core-js/features/promise', `./app.js`],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test:/\.svg$/,
                use: [{
                    loader: "svg-inline-loader"
                }]
            },
            {
                test: /\.png$/,
                use:[{
                    loader: "file-loader",
                    options: {
                        name: "img/[name].[ext]",
                        limit: 1000
                    }
                }]
            },
            {
                test: /\.css/,
                use: extractPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                })
            }
        ]
    },
    watch: true,
    devServer: {
        contentBase: path.resolve(__dirname, 'src'),
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Custom Template',
            template: 'index.html',
            hash: true
        }),
        extractPlugin,
    ]
};
