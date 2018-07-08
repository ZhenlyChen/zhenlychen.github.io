---
title: C | 语句与声明的一些区别
date: 2017-07-21 21:12:27
tags: ["C","问题"]
categories: "C"
---

遇到了一个非常有趣的C语言问题

<!--more-->

```c
for (int i = 0;i < 5; i++) {
    int a = i;
}
//----------正常编译
for (int i = 0;i < 5; i++) int a = i;
//----------编译错误（Syntax error）语法错误



if(1){
      int b =10;
}
//----------正常编译

if(1) int b =10;
//----------编译错误（Syntax error）语法错误
```



按照C语言的标准，在for，if， while等语句之中，如果里面的代码只有一行的话，是可以省略花括号的，那么上面的代码自然而然又是**等价**的，但是神奇的是，省略花括号的无一不出现编译错误。



为什么会这样呢？神奇



首先，查了查度娘，意料之中没有得到答案，然后去Google，很快就得到了答案



**原因在于C语言标准规定if语句后面要跟代码块或者是一个语句，然而`int a = i` 并不是一个语句 *statement*，而是一个声明 *declaration*，这两者是有很大的区别的.**



以下是C标准关于语句和定义的内容

> ```
> (6.7) declaration:
>             declaration-speciﬁers init-declarator-listopt ;
>             static_assert-declaration
>
> (6.7) init-declarator-list:
>             init-declarator
>             init-declarator-list , init-declarator
>
> (6.7) init-declarator:
>             declarator
>             declarator = initializer
>
> (6.8) statement:
>             labeled-statement
>             compound-statement
>             expression-statement
>             selection-statement
>             iteration-statement
>             jump-statement
>
> (6.8.2) compound-statement:
>             { block-item-listopt }
>
> (6.8.4) selection-statement:
>             if ( expression ) statement
>             if ( expression ) statement else statement
>             switch ( expression ) statement
> ```



这样一来，后者就出现了语法错误，然而把他放入花括号里面就可以。