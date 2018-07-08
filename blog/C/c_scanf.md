---
title: C | 用scanf处理带有多个空格的输入
date: 2017-07-21 20:15:27
tags: ["C"]
categories: "C"
---

刚刚入门C语言的时候，初学者一开始学习输入输出难免会遇到各种奇怪的输入，所以就来学习一下scanf是怎么做到处理含有空格的输入的。

<!--more-->



## 1. Scanf的基本用法

```c
int scanf ( const char * format, ... );
```

**首先让我们来了解一下scanf函数的基本用法。**

scanf是C语言标准输入流（stdio）里面提供的一个输入数据的函数，对于不同的数据类型可以用用不同的格式来读取，然后储存在变量之中。

下表是各种数据类型用scanf时的标识

> | specifier     |                   Description |           Characters extracted           |
> | ------------- | ----------------------------: | :--------------------------------------: |
> | i             |                       Integer | Any number of digits, optionally preceded by a sign (+ or -).Decimal digits assumed by default (0-9), but a 0 prefix introduces octal digits (0-7), and 0x hexadecimal digits (0-f).Signed argument. |
> | d or u        |               Decimal integer | Any number of decimal digits (0-9), optionally preceded by a sign (+ or -).d is for a signed argument, and u for an unsigned. |
> | o             |                 Octal integer | Any number of octal digits (0-7), optionally preceded by a sign (+ or -).Unsigned argument. |
> | x             |           Hexadecimal integer | Any number of hexadecimal digits (0-9, a-f, A-F), optionally preceded by 0x or 0X, and all optionally preceded by a sign (+ or -).Unsigned argument. |
> | f, e, g	,a    |         Floating point number | A series of decimal digits, optionally containing a decimal point, optionally preceeded by a sign (+ or -) and optionally followed by the e or E character and a decimal integer (or some of the other sequences supported by strtod).Implementations complying with C99 also support hexadecimal floating-point format when preceded by 0x or 0X. |
> | c             | Character	The next character. | If a width other than 1 is specified, the function reads exactly width characters and stores them in the successive locations of the array passed as argument. No null character is appended at the end. |
> | s             |          String of characters | Any number of non-whitespace characters, stopping at the first whitespace character found. A terminating null character is automatically added at the end of the stored sequence. |
> | p             |               Pointer address | A sequence of characters representing a pointer. The particular format used depends on the system and library implementation, but it is the same as the one used to format %p in fprintf. |
> | [characters]  |                       Scanset | Any number of the characters specified between the brackets.A dash (-) that is not the first character may produce non-portable behavior in some library implementations. |
> | [^characters] |               Negated scanset | Any number of characters none of them specified as characters between the brackets. |
> | n             |                         Count | No input is consumed.The number of characters read so far from stdin is stored in the pointed location. |
> | %             |                             % | A % followed by another % matches a single %. |
>
> 引用自http://www.cplusplus.com/reference/cstdio/scanf/

用上表的各种格式可以输入各种数据格式到程序中进行处理
**但是，在遇到空格的时候，scanf明显遇到了问题**

------

## 2. 输入带有空格的字符串

```c
#include <stdio.h>
int main()
{
	char str[1000];
	scanf("%s",&str);
	printf("\n%s\n",str);
	return 0;
} 
```

运行上述一段代码，输入**HelloWorld**，我们会得到这样一个结果：

![运行结果1](http://img.blog.csdn.net/20160928224646524)

 这一次，我们来输入**Hello World**，会是怎么样的呢？

 ![运行结果2](http://img.blog.csdn.net/20160928224747580)

***这是为什么呢？***

原来，在

```c
scanf("%s",&str);
```

中，scanf函数遇到  `TAB` $\bigcup$ `空格`  $\bigcup$ `\n` 的时候视为输入结束。
那么，难道scanf就不可以用来输入带有空格的字符串吗？[^other]答案当然是否定的，我们可以改一下数据类型，像下面这样：

```c
scanf( "%[^\n]",str)；
```

修改代码后，重新执行一次看看：
![这里写图片描述](http://img.blog.csdn.net/20160928225635583)

完美运行！

这是为什么呢？

**其实 `%[^\n]` 的意思就是“遇到换行才结束”，那样，在我们输入空格的时候，scanf就不用自动终止读取了，直到我们按下回车换行。**

同样的道理`%[^ ]` 的意思就是“遇到空格就结束”，那样和我们一开始的程序的功能是一模一样的，以此类推，我们可以得到scanf函数的扩展，利用这个功能，我们可以对字符串进行更快捷更方便的处理啦！O(∩_∩)O

------

## 3.处理未知数量的多个数据

当我们要用scanf输入一大串，不知道多少的字符的时候，就要用到EOF文件末[^eof]
代码如下：

```c
int a = 0, sum = 0;
while (scanf("%d", &a) != EOF) {
  sum += a;//这里可以把数据存入数组，方便接下来的处理
}
```

这里运用到了While循环语句，一直读取输入字符串，以遇到  `TAB`  $\bigcup$ `空格` $\bigcup$ `\n` 的时候视为输入一个数据结束，然后一直输入数据，直到读取到EOF文件末。

------

当然还有其他的方法，就是利用`<string.h>`里面的strtok函数[^strtok]，缺点就是异常复杂，但是优点就是可以用各种字符来分割输入的字符串

```c
#include<stdio.h>
#include<string.h>
#include <stdlib.h>
int main(){
 char num[100000];//定义字符串
 int temp;//临时储存变量，也可以换成char类型
 //gets(num);
 scanf( "%[^\n]", num );//忽略空格停止，一直扫描字符串至换行
 char* token = strtok(num, " ");//这里是以空格作为分割符
temp=atoi(token);
 while( token != NULL )
      {
      	temp=atoi(token);
			//这里可以对 进行处理
			//也可以传进数组里
        token = strtok( NULL, " ");
      }
return 0;
}
```

## 总结

通过多种示例，我们了解到了scanf函数对多个空格的字符串的多种处理方法，也加深了我对这一函数的认识

------

感谢阅读，初次写博客错误在所难免，如有不当之处，希望得到大家的指正，谢谢！

[^eof]: 

Scanf and EOF (End Of F文件末)自己在本地测试时，也能输入EOF。Windows中，先输入数据回车，按下`Ctrl+Z`，命令行里出现`^z`，回车，就会写入EOF。Linux中，先输入数据再回车，按下`Ctrl+d`，就会写入EOF。

[^other]: 我们还可以利用其它的函数来读取，比如，用gets（）读取字符串，遇\n结束，会把\n读取，转换为\0，输入流中不再有\n。

参考：http://www.cplusplus.com/reference/cstdio/gets/

[^strtok]: 

strtok
定义函数：char * strtok(char *s, const char *delim);
函数说明：strtok()用来将字符串分割成一个个片段。参数s 指向欲分割的字符串，参数delim 则为分割字符串，当strtok()在参数s 的字符串中发现到参数delim 的分割字符时则会将该字符改为\0 字符。在第一次调用时，strtok()必需给予参数s 字符串，往后的调用则将参数s 设置成NULL。每次调用成功则返回下一个分割后的字符串指针。
返回值：返回下一个分割后的字符串指针，如果已无从分割则返回NULL。
参考：http://www.cplusplus.com/reference/cstring/strtok/

