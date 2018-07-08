---
title: Web | WebPack 配置过程（Vue、Babel、Sass）
date: 2017-09-16 10:01:22
tags: ["Web","Webpack","Vue","Sass"]
categories: "Web"
---

打算重构XMoj的前端，使用新的架构，记录下配置过程，以便以后查询，如果你也想用这个架构，那么这篇文章将带你一步一步安装和配置各种环境，一步步地了解各种组件的基本使用方式，最后搭成一个多组件的网页应用。如果你想快速搭建，那么可以直接看文章底部。

<!--more-->

## 安装

首先我们先新建一个工程的文件夹，并且用npm初始化

```
//全局安装
npm install -g webpack
//初始化项目
npm init
//安装到你的项目目录
npm install --save-dev webpack
```



## 基本项目结构

```
Project
	node_modules
		...
	app
		test.js
		main.js
	public
		index.html
	index.js
	package.json
	webpack.config.js
```



## 一个简单的例子

```js
//main.js 
const greeter = require('./test.js');
document.querySelector("#root").appendChild(greeter());
```

```js
// test.js
module.exports = function() {
  var greet = document.createElement('div');
  greet.textContent = "Hi there and greetings!";
  return greet;
};
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Webpack Sample Project</title>
  </head>
  <body>
    <div id='root'>
    </div>
    <script src="bundle.js"></script>
  </body>
</html>
```



## 开始使用Webpack

### 直接命令行调用

```shell
webpack app/main.js public/bundle.js
```

### 通过Webpack配置调用

```js
// webpack.config.js
module.exports = {
  entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件
  output: {
    path: __dirname + "/public",//打包后的文件存放的地方
    filename: "bundle.js"//打包后输出文件的文件名
  }
}
```

```shell
webpack
```

### 通过项目配置调用

```json
// package.json
{
  "name": "webpack-sample-project",
  "version": "1.0.0",
  "description": "Sample webpack project",
  "scripts": {
    "start": "webpack" // 修改的是这里，JSON文件不支持注释，引用时请清除
  },
  "author": "zhang",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^1.12.9"
  }
}
```

```shell
npm start
```



## 生成Source Maps

| devtool选项                    | 配置结果                                     |
| ---------------------------- | ---------------------------------------- |
| source-map                   | 在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的`source map`，但是它会减慢打包速度； |
| cheap-module-source-map      | 在一个单独的文件中生成一个不带列映射的`map`，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便； |
| eval-source-map              | 使用`eval`打包源文件模块，在同一个文件中生成干净的完整的`source map`。这个选项可以在不影响构建速度的前提下生成完整的`sourcemap`，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定不要启用这个选项； |
| cheap-module-eval-source-map | 这是在打包文件时最快的生成`source map`的方法，生成的`Source Map` 会和打包后的`JavaScript`文件同行显示，没有列映射，和`eval-source-map`选项具有相似的缺点 |

```js
// webpack.config.js
module.exports = {
  devtool: 'eval-source-map',
  entry:  __dirname + "/app/main.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  }
}

```



## 使用webpack构建本地服务器

```
npm install --save-dev webpack-dev-server
```

```js
// webpack.config.js
module.exports = {
  devtool: 'eval-source-map', //source-map cheap-module-source-map eval-source-map cheap-module-eval-source-map
  entry: __dirname + "/app/main.js", //唯一入口文件
  output: {
    path: __dirname + "/public", //打包后的文件存放的地方
    filename: "bundle.js" //打包后输出文件的文件名
  },
  devServer: {
    contentBase: "./public", //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true, //实时刷新
    port: 8080
  },
}
```

```json
// package.json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack",
    "server": "webpack-dev-server --open"
 },
```

## Babel模块安装

```shell
// npm一次性安装多个依赖模块，模块之间用空格隔开
npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react
```

```js
// webpack.config.js
module.exports = {
    entry: __dirname + "/app/main.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/public",//打包后的文件存放的地方
        filename: "bundle.js"//打包后输出文件的文件名
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: "./public",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            }
        ]
    }
};
```

配置文件放项目根目录下

```json
//.babelrc
{
  "presets": ["react", "es2015"]
}
```





## Vue模块安装

### 安装

```
// 安装vue
npm install --save vue
// 解析vue组件
npm install --save-dev vue-loader vue-template-compiler
// 解析CSS
npm install --save-dev css-loader file-loader 
```

### 一个简单的例子

```vue
<!-- ./src/App.vue -->
<template>
  <div id="example">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="n in 5">{{ n }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello World!'
    }
  }
}
</script>

<style scoped>
#example {
  background: red;
  height: 100vh;
}
</style>
```

```js
// ./src/main.js
/* 引入vue和主页 */
import Vue from 'vue'
import App from './App.vue'

/* 实例化一个vue */
new Vue({
 el: '#app',
 render: h => h(App)
})
```

```html
<!-- ./index.html-->
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
<title>vue-webpack</title>
</head>
<body>
  <section id="app"></section>
  <script src="./dist/build.js"></script>
</body>
</html>
```

```js
// webpack.config.js
let path = require('path');
module.exports = {
  devtool: 'eval-source-map', //source-map cheap-module-source-map eval-source-map cheap-module-eval-source-map
  entry: './src/main.js',
  output: {
    /* 输出目录，没有则新建 */
    path: path.resolve(__dirname, './dist'),
    /* 静态目录，可以直接从这里取文件 */
    publicPath: '/dist/',
    /* 文件名 */
    filename: 'build.js'
  },
  devServer: {
    contentBase: "./public", //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true, //实时刷新
    port: 8080
  },
  module: {
    rules: [{
      test: /(\.jsx|\.js)$/,
      loader: "babel-loader",
      exclude: /node_modules/
    }, {
      test: /\.vue$/,
      loader: 'vue-loader'
    }]
  }
}
```



## Sass模块安装

```
//在项目下，运行下列命令行
npm install --save-dev sass-loader
//因为sass-loader依赖于node-sass，所以还要安装node-sass
npm install --save-dev node-sass
//使用样式的话，css-loader和style-loader也是必须的依赖包
npm install --save-dev css-loader style-loader
```

- css-loader使你能够使用类似@import 和 url(…)的方法实现 require()的功能；
- style-loader将所有的计算后的样式加入页面中；

　　二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中。

配置

```js
// webpack.config.js
{
   test: /\.scss$/,
   loaders: ["style", "css", "sass"]
}
```



sass的使用如下，例如：

- 引入外部样式，下面两种写法都可以使用：

```
import '../../css/test.scss'
require('../../css/test2.scss');
```

- 在.vue文件中使用

```
<style lang="sass">
     //sass语法样式
</style>
```



## Vue组件使用

到了这里，我们就要使用Vue的组件、Babel、Sass了，通过配置webpack，直接生成html

```js
// webpack.config.js
let path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  devtool: 'eval-source-map', //source-map cheap-module-source-map eval-source-map cheap-module-eval-source-map
  entry: './src/main.js',
  output: {
    /* 输出目录，没有则新建 */
    path: path.resolve(__dirname, './dist'),
    /* 静态目录，可以直接从这里取文件 */
    publicPath: '',
    /* 文件名 */
    filename: '[name].js',
  },
  devServer: {
    contentBase: "./public", //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true, //实时刷新
    port: 8080
  },
  resolve: { // 这个很重要，需要把vue设置为独立构建，不然无法进行
    alias: {
      'vue': 'vue/dist/vue.js'
    }
  },
  module: {
    rules: [{
      test: /(\.jsx|\.js)$/,
      loader: "babel-loader",
      exclude: /node_modules/
    }, {
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.scss$/,
      loaders: ["style", "css", "sass"]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './index.html'),
      inject: true
    })
  ]
}
```

```js
// src/main.js
/* 引入vue和主页 */
import Vue from 'vue';
import App from './App.vue';
Vue.config.debug = true; //开启错误提示
/* 实例化一个vue */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
```

```vue
<!-- src/App.vue -->
<template>
  <div id="example">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="n in 5" :key="n">{{ n }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello World!'
    }
  }
}
</script>

<style lang="scss">
#example {
  background: wheat;
  height: 100%;
  width: 100%;
  position:fixed;
}
</style>
```



## Vue组件路由使用

接下来，我们的需求就是要使用路由显示多个页面。



。。。

然而在我手动搭好整个项目的时候，发现这些东西都可以由vue-cli一键生成，这就非常地绝望了。

所以下面讲一下如何使用vue-cli搭建项目



## Vue-cli的使用

### 安装

```shell
 // 全局安装
 npm install -g vue-cli
 // 初始化项目
 vue init webpack projectName
 // 安装依赖
 cd projectName
 npm install
```

然后我们的项目就搭好了

```
// 建立静态文件
npm run build
```

然后配置一下Sass就可以直接使用了





## 参考网页

 [入门*Webpack*,看这篇就够了 - 简书](http://www.jianshu.com/p/42e11515c10f)

[详解用webpack2.0构建vue2.0超详细精简版](http://www.jb51.net/article/110362.htm)

[*webpack*配置*sass*模块的加载 - 浅岸 - 博客园](http://www.cnblogs.com/ww03/p/6037710.html)

[webpack打包vue2.0项目时必现问题。](http://www.imooc.com/article/17868)

[vue-cli构建vue项目](http://www.cnblogs.com/xuange306/p/6092225.html)

[vue-cli webpack配置分析](https://segmentfault.com/a/1190000008644830)