const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
        index: './src/js/index.js',
        element: './src/js/element.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'])
    ]
}