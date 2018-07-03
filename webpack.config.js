const path = require('path');
const webpack = require('webpack');  // 用于访问内置插件
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: ['babel-polyfill', './src/main.js'], // 项目的入口文件，webpack会从main.js开始，把所有依赖的js都加载打包
    output: {
        path: path.resolve(__dirname, './dist'),  // 项目的打包文件路径
        filename: 'build.js',
    },
    devServer: {
        historyApiFallback: true,  // 任意的 404 响应都可能需要被替代为 index.html
        overlay: true, // 当出现编译器错误或警告时，在浏览器中显示全屏叠加。
    },
    resolve: {
        alias: { // 创建 import 或 require 的别名，来确保模块引入变得更简单
            'vue$': 'vue/dist/vue.esm.js',
        }
    },
    module: {
        rules: [
            { // 匹配后缀名为css的文件,然后分别用css-loader，vue-style-loader去解析.解析器的执行顺序是从下往上
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            }, {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            }, {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader?indentedSyntax'
                ],
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    nmae: '[name].[ext]?[hash]'
                }
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader'
                        ],
                        'sass': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader?indentedSyntax'
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin()
    ],
    devtool: '#eval-source-map',
};

