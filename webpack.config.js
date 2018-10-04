const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: `./src/app.js`,
    output: {
        path: `${__dirname}/dist`,
        filename: '[name].bundle.js'
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
                loader: ['style-loader','css-loader']
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
            template: './src/index.html',
            hash: true
        }),
        new ExtractTextPlugin({
            filename: './bundle.styles.css'
        })
    ]
};
