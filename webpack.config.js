const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin')

let extractPlugin = new ExtractTextPlugin({
    filename: './bundle.styles.css'
})
module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: `./app.js`,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
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
        "transform-async-to-generator"
    ]
};
