const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        hello: './src/js/hello.js',
        hello1: './src/js/hello1.js'
    },
    output: {
        filename: 'js/[name].js',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([
            {from:'src/imgs',to:'imgs'},
            {from:'src/jsons',to:'jsons'}
        ]),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env']
                    }
                }
            },
            {
                test: /\.less$/,
                exclude: '/node_modules/',
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                exclude: '/node_modules/',
                use: [
                    'file-loader',
                ],
            },
        ]
    }
}