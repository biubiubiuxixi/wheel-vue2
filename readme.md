简单的webpac-vue

# 全局安装webpack
```
npm install webpack -g
```

# 项目初始化
新建一个项目的空文件夹

新建package.json
```
npm init -y
```

安装vue webpack webpack-dev-server
```
npm install vue --save
```
```
npm install webpack webpack-dev-server --save-dev
```

根目录下新建index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
```

根目录下新建webpack.config.js
```
var path = require('path');
var webpack = require('webpack');
module.exports = {};
```

根目录下新建src文件夹，src文件夹下新建main.js

# js模块化
src目录下新建一个util.js
```
module.exports = function say() {
    console.log('hello world');
}
```

main.js
```
var say = require('./util');
say();
```

修改webpack.config.js
```
var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: './src/main.js', // 项目的入口文件，webpack会从main.js开始，把所有依赖的js都加载打包
    output: {
        path: path.resolve(__dirname, './dist'), // 项目的打包文件路径
        publicPath: '/dist/', // 通过devServer访问路径
        filename: 'build.js' // 打包后的文件名
    },
    devServer: {
        historyApiFallback: true, // 任意的 404 响应都可能需要被替代为 index.html
        overlay: true, // 当出现编译器错误或警告时，在浏览器中显示全屏叠加。
    }
};
```

修改package.json
```
"scripts": {
    "dev": "webpack-dev-server --open --hot",
    "build": "webpack --progress --hide-modules"
},
```
注意：webpack-dev-server会自动启动一个静态资源web服务器 –hot参数表示启动热更新

新建文件夹dist
在dist文件夹下新建build.js文件

修改index.html，引入build.js
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <script src="/dist/build.js"></script>
</body>
</html>
```

运行
```
npm run dev
```

webpack默认不支持转码es6，但是import export这两个语法却单独支持。所以我们可以改写前面的模块化写法

修改util.js
```
export default function say() {
    console.log('hello world ');
}
```

修改main.js
```
import say from './util';
say();
```

# 引入vue

修改main.js
```
import Vue from 'vue';
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
});
```

修改index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="app">
        {{message}}
    </div>
    <script src="/dist/build.js"></script>
    
</body>
</html>
```

修改webpack.config.js
```
const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'build.js'
    },
    devServer: {
        historyApiFallback: true,
        overlay: true
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin()
    ],
};
```

运行看结果


#引入scss/css
```
npm i node-sass css-loader vue-style-loader sass-loader --save-dev
```
修改webpack.config.js
```
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
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader?indentedSyntax'
                ],
            }]
    },
};

```

# babel转换
```
npm install babel-core babel-loader babel-preset-env babel-preset-stage-0 --save-dev
```

在根目录新建.babelrc
```
{
  "presets": [
    ["env", { "modules": false }],
    "stage-0"
  ]
}
```

修改webpack.config.js添加一个人loader
```
{
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/, // exclude表示忽略node_modules文件夹下的文件，不用转码
}
```

async await语法吧
修改util.js
```
export default function getData() {
    return new Promise((resolve, reject) => {
        resolve('ok');
    })
}
```

修改main.js
```
import getData from './util';
import Vue from 'vue';
import './style/common.scss';
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  methods: {
    async fetchData() {
      const data = await getData();
      this.message = data;
    }
  },
  created() {
    this.fetchData();
  }
});
```

安装babel-polyfill
```
npm i babel-polyfill --save-dev
```

修改webpack.config.js入口
```
entry: ['babel-polyfill', './src/main.js'],
```

正常运行

# 引入图片资源
```
npm i file-loader --save-dev
```

修改webpack.config.js 添加loader
```
{
    test: /\.(png|jpg|gif|svg)$/,
    loader: 'file-loader',
    options: {
        name: '[name].[ext]?[hash]'
    }
}
```
在src目录下新建一个img目录，存放一张图片logo.png

修改main.js
```
import getData from './util';
import Vue from 'vue';
import './style/common.scss';
Vue.component('my-component', {
  template: '<img :src="url" />',
  data() {
    return {
      url: require('./img/logo.png')
    }
  }
})
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue !'
  },
  methods: {
    async fetchData() {
      const data = await getData();
      this.message = data;
    }
  },
  created() {
    this.fetchData()
  }
});
```

修改index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="app">
        {{message}}
        <my-component/>
    </div>
    <script src="/dist/build.js"></script>
    
</body>
</html>

```
可以加载到图片

# 单文件组件
```
npm i vue-loader vue-template-compiler --save-dev
```

添加一个loader 并引入一个插件
```
{
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
```
```
const VueLoaderPlugin = require('vue-loader/lib/plugin');
    plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin()
    ],
```

在src目录下新建一个App.vue
```
<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <img src="./img/logo.png">
    <input type="text" v-model="msg">
  </div>
</template>
<script>
import getData from './util';
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js'
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
     async fetchData() {
      const data = await getData();
      this.msg = data;
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  h1 {
    color: green;
  }
}
</style>
```

main.js
```
import Vue from 'vue';
import App from './App.vue';
import './style/common.scss';
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
```

index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
    <script src="/dist/build.js"></script>
</body>
</html>
```

#source-map
```
module.exports = {
    entry: ['babel-polyfill', './src/main.js'],
    // 省略其他...
    devtool: '#eval-source-map' // 可以看到console.log的具体文件地址方便调试
};
```






