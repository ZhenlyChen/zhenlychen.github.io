---
title: Web | Sass 学习笔记
date: 2017-09-14 0:20:27
tags: ["Web","Sass", "css"]
categories: "Web"
---

很久之前的XMatrix团队的第一次例会(其实并没有几个人)决定了Xmoj这个项目要弄一套自己的UI，使用Sass来构建一套XMUI，但是一直都没有去学习，现在又有一个项目需要用到Sass，所以就赶紧来学习一波了。

<!--more-->

## 使用前准备

### 安装Ruby

Sass是基于Ruby开发的，因此我们首先要安装ruby，我安装的是win版的，直接官网下载，然后添加一下环境变量就安装好了

### 安装Sass

```shell
gem install sass
gem install compass
```

compass是sass的一个比较好的工具库，他可以帮助我们更快得构建sass项目，而且里面封装了很多模块，但是我在使用gem的时候总是需要管理员权限才能安装。

### Sass编译器用法

```shell
//单文件转换命令
sass input.scss output.css

//单文件监听命令
sass --watch input.scss:output.css

//如果你有很多的sass文件的目录，你也可以告诉sass监听整个目录：
sass --watch app/sass:public/stylesheets

//编译格式
sass --watch input.scss:output.css --style compact

//编译添加调试map
sass --watch input.scss:output.css --sourcemap

//选择编译格式并添加调试map
sass --watch input.scss:output.css --style expanded --sourcemap

//开启debug信息
sass --watch input.scss:output.css --debug-info
```

### Compass使用方法

```shell
//项目初始化
compass create helloworld

//编译
compass compile

//压缩
compass compile --output-style compressed

//自动编译
compass watch
```



## 变量声明

```css
$xxx:#fff;
$aaa:1px soild #fff;
```

sass有一个特点是下划线和中划线是等价的，所以变量a_b和a-b其实是一样的

## 嵌套css

```css
#content {
  article {
    h1 { color: #333 }
    p { margin-bottom: 1.4em }
  }
  aside { background-color: #EEE }
}
// 编译后
#content article h1 { color: #333 }
#content article p { margin-bottom: 1.4em }
#content aside { background-color: #EEE }
```

由于嵌套规则对于一些伪类需要使用父选择器的标识符&

```css
article a {
  color: blue;
  &:hover { color: red }
}
```



## 子组合选择器

```css
article section { margin: 5px }
// 选择article下的所有section元素
article > section { border: 1px solid #ccc }
// [子组合选择器] 选择article下的第一代的section元素
header + p { font-size: 1.1em }
// [同层组合选择器] 选择header元素同层后面的p元素
article ~ article { border-top: 1px dashed #ccc }
// [同层所有组合选择器] 选择所有跟在article后的同层article元素，不管它们之间隔了多少其他元素
// 对于所有选择器可以随意嵌套
article {
  ~ article { border-top: 1px dashed #ccc }
  > section { background: #eee }
  dl > {
    dt { color: #333 }
    dd { color: #555 }
  }
  nav + & { margin-top: 0 }
}
```

## 嵌套属性

```css
nav {
  border: {
  style: solid;
  width: 1px;
  color: #ccc;
  }
}
// 编译成
nav {
  border-style: solid;
  border-width: 1px;
  border-color: #ccc;
}


nav {
  border: 1px solid #ccc {
  left: 0px;
  right: 0px;
  }
}
// 编译成
nav {
  border: 1px solid #ccc;
  border-left: 0px;
  border-right: 0px;
}
```



## 注释

```css
body {
  color: #333; // 这种注释内容不会出现在生成的css文件中
  padding: 0; /* 这种注释内容会出现在生成的css文件中 */
}
```



## 混合器

```css
@mixin rounded-corners {
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
notice {
  background-color: green;
  border: 2px solid #00aa00;
  @include rounded-corners;
}
// 编译成
.notice {
  background-color: green;
  border: 2px solid #00aa00;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}


//带参数的用法
@mixin link-colors($normal, $hover, $visited) {
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}
a {
  @include link-colors(blue, red, green);
}
// 编译后
a { color: blue; }
a:hover { color: red; }
a:visited { color: green; }


//默认参数的用法
@mixin link-colors(
    $normal,
    $hover: $normal,
    $visited: $normal
  )
{
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}
```



## 继承

```css
//通过选择器继承继承样式
.error {
  border: 1px solid red;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
```



[文档查询](https://www.sass.hk/docs/)