---
title: C | 标准输入输出和字符串
date: 2017-07-21 21:13:27
tags: ["C","C大学教程", "读书笔记"]
categories: "C"
---

对C语言的字符处理函数库、通用函数库、标准输入输出函数库、字符串处理函数库的学习笔记

<!--more-->

## 目标

- 使用 ` 字符处理函数库（ctype）` 中的函数
- 使用 `通用函数库 （stdlib）` 中的 `字符串转换函数`
- 使用 `标准输入输出函数库 （stdio）` 中的 `字符串`和`字符输入输出函数`
- 使用 `字符串处理函数库` 中的 `字符串处理函数`
- 函数库的功能

## 重点

### 8.2 字符串和字符基础

- `char*` 类型的变量用字符串初始化的时候，字符串是放在内存里无法改写的区域  ，如果要进行修改，要先储存到一个字符数组中

- `scanf函数` 读入字符知道遇到 空格、 tab键、 换行符、EOF 为止

- 格式转换说明符` %19s` ：使scanf函数最多读入19个字符，并把\0 储存到数组中

- 函数` readline （非标准）`可以读取任意长度的输入行

- 调用函数是要注意区分 字符串 和 字符 

  ​

### 8.3 字符处理函数库（ctype.h）

- 这一部分就是用里面各种函数判断是否为 数字、字母、 空格、小写、 大写，然后转下大小写 而已

### 8.4 字符串转换函数 （stdlib.h）



​	可以将字符串 转换为 各种类型的数字 

| 函数      | 类型            |
| :------ | ------------- |
| atof    | double        |
| atoi    | int           |
| atol    | long          |
| strtod  | double        |
| strtol  | long          |
| strtoul | unsigned long |



- 注意 ： 用下面三个函数的时候要注意参数不止一个

| 函数     | 参数1（char *） | 参数2（char **） | 参数3（int）     |
| ------ | ----------- | ------------ | ------------ |
| strtod | 目标字符串       | 指向导致溢出的字符的地址 | 无            |
|        | 目标字符串       | 指向导致溢出的字符的地址 | 识别为几进制(2-36) |
|        | 目标字符串       | 指向导致溢出的字符的地址 | 识别为几进制       |

- 注意：

- 1. 如果要转换的字符串太长，超出了无符号长整型值的取值范围，strtoul()函数将返回ULONG_MAX(4294967295)，

  - 参数2 是一个指向 地址 的 地址 一般格式是  `&指针名` 

**值得注意的是** 经过我的实验

------

在 `Dev-C++`  和 `TDM-GCC 4.9.2` 的环境下，

------

`ato* 函数` 如果字符串里面第一个字符不是数字的话 返回的是 null ，

​	如果第一个字符是数字 ，第二的不是的话 ， 那么 程序就会 GG， 无响应

------

`strto*函数` 如果字符串里面第一个字符不是数字的话 返回的是 0 ，

​	如果第一个字符是数字 ，第二的不是的话 ， 那么 函数就会 返回 直到第一个字母之前的数字，比如“13ab23” 就会 返回 “12”

​	然后参数二的地址的内容就会被返回 第一个字母开始的字符串 比如上面的就是 “ab23” 

------



### 8.5 标准输入输出库函数(stdio.h)



看到一个很美妙的递归输出代码，分享一下

```c
void reverse (const char *const sPtr){
  if (sPtr[0] == '\0'){
    return;
  } else {
    reverse (&sPtr [1]);
    putchar (sPtr[0]);
  }
}
```



- 用 getchar() 的时候记得 字符串最后要加个`'\0'` （貌似以前都没有加 逃...）
- 用puts 的话会自动换行的

### 8.6 字符串处理函数库中的字符串处理函数（string.h）

- strcpy, strncpy, strcat, strncat 这些函数返回都是第一个参数


- 使用strncpy的时候可以利用第三个参数的值（比字符串长度多一） 决定 是否 复制 `\0`

### 8.7 字符串处理库中的比较函数（string.h）

strcmp , strncmp

- 按字典序（ascii码）
- 注意 ： 以上带n的函数第三个参数实际上的类型是 `size_t`

### 8.8 字符串处理函数库的查找函数（string.h）

- strcspn ， strspn 返回值类型都是 `size_t`

### 8.9 字符串处理函数库的内存函数（string.h）

- 感觉和上面的差不多，就是基于内存的操作，都需要自己设置长度（是基于内存的长度，比如一个int就是4）（还有对于任何数据类型都可以用）

- 补充一下指针知识

  - 指向任意数据类型的指针都可以直接赋给类型为 void* 的指针变量，同时类型为 void* 的指针也可以直接赋给指向任意数据类型的指针变量（晚上有的说需要强制类型转换，但是尴尬的是我在Dev-cpp里面是不需要的，可能这是Dev-cpp的一个特性吧（更有可能是GNU的锅），真**尴尬**）

  - void指针不能进行算法操作（尴尬的是GNU认定void* 和char* 的算法操作是一样的，是可以的，又**尴尬**起来了）

  - > 因此下列语句在GNU编译器中皆正确：
    >
    > 　　pvoid++; //GNU：正确
    >
    > 　　pvoid += 1; //GNU：正确
    >
    > 　　pvoid++的执行结果是其增大了1。( 在VC6.0上测试是sizeof(int)的倍数)
    >
    > 　　在实际的程序设计中，为迎合ANSI标准，并提高程序的可移植性，我们可以这样编写实现同样功能的代码：
    >
    > 　　void * pvoid;
    >
    > 　　(char *)pvoid++; //ANSI：正确；GNU：正确
    >
    > 　　(char *)pvoid += 1; //ANSI：错误；GNU：正确
    >
    > 　　GNU和ANSI还有一些区别，总体而言，GNU较ANSI更“开放”，提供了对更多语法的支持。但是我们在真实设计时，还是应该尽可能地迎合ANSI标准。

- memmove的一个特性是把第二个实参先复制到一个临时的字符数组中，在从临时数组复制到第一个实参里面

  （书本说只有这个函数能处理同一字符串的不同部分，但是我用strncpy也能实现相同的功能，那又很**尴尬**了）

### 8.10 字符串后处理函数库中的其他函数（string.h）

- strlen 返回的长度不算`\0`