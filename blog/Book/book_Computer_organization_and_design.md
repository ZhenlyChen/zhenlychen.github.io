---
title: 读书笔记 | 计算机组成与设计 - 概要和指令
date: 2018-04-03 20:10:00
tags: ["读书笔记", "MIPS"]
categories: "Book"
---

因为下个学期要学习计组，然后又有点兴趣，所以在寒假期间就打算看一遍这本书，记录一下重点，以便以后查看。

补充：寒假只看了两章，此文章只包括第一二章的内容。主要介绍了计算机组成的概要以及MIPS指令的基本用法。后面的内容有时间再更。😁

<!--more-->

## 第一章 - 计算机概要与技术

### 分类

- 个人计算机(Personal Computer, PC)
- ​
- 超级计算机 (supercomputer)
- 嵌入式计算机(embedded computer)

### 二进制与十进制表达

| 十进制术语     | 缩写   | 数值        | 二进制术语    | 缩写   | 数值       | 数值差别   |
| --------- | ---- | --------- | -------- | ---- | -------- | ------ |
| kilobyte  | KB   | $10^3$    | kibibyte | KiB  | $2^{10}$ | $2\%$  |
| megabyte  | MB   | $10^6$    | mebibyte | MiB  | $2^{20}$ | $5\%$  |
| gigabyte  | GB   | $10^9$    | gibibyte | GiB  | $2^{30}$ | $7\%$  |
| terabyte  | TB   | $10^{12}$ | tebibyte | TiB  | $2^{40}$ | $10\%$ |
| petabyte  | PB   | $10^{15}$ | pebibyte | PiB  | $2^{50}$ | $13\%$ |
| exabyte   | EB   | $10^{18}$ | exbibyte | EiB  | $2^{60}$ | $15\%$ |
| zettabyte | ZB   | $10^{21}$ | zebibyte | ZiB  | $2^{70}$ | $18\%$ |
| yottabyte | YB   | $10^{24}$ | yobibyte | YiB  | $2^{80}$ | $21\%$ |

PS: 对于bit同样使用，比如 gigabit(Gb) 是 $10^9$ bit, gigibit (Gib) 是 $2^{30}$ bit

PS: 网络带宽单位bps为(bit/s)， Bps为(Byte/s)

### 后PC时代

- 个人移动设备(Personal Mobile Device, PMD)
- 云计算(cloud computing)
  - 仓储规模计算机(Warehouse Scale Computer, WSC)
- 软件即服务(Software as a Service, SaaS)


### 八大伟大思想

- 面向摩尔定律的设计
- 使用抽象简化设计
- 加速大概率事件
- 通过并行提高性能
- 通过流水线提高性能
- 通过预测提高性能
- 存储器层次
- 通过冗余提高可靠性

### 性能的量度

CPU执行时间(CPU execution time)

- 用户CPU时间(user CPU time)[CPU性能(CPU performance)表示用户CPU时间]
- 系统CPU时间(system CPU time)

性能的影响因素

$一个程序的CPU执行时间 = 一个程序的CPU时钟周期数 \times 时钟周期时间 $

指令的性能

$CPU时钟周期数 = 程序的指令数 \times 每条指令的平均时钟周期数$

- CPI(clock cycle per instruction) 每条指令所需的时钟周期数的平均值

经典CPU性能公式

$CPU时间 = 指令数 \times CPI \times 时钟周期的时间$

MIPS(million instructions per second, 每秒百万条指令)

$MIPS =  \frac{指令数}{执行时间 \times 10^6} =  \frac{指令数}{指令数 \times \frac{CPI}{时钟频率} \times 10^6} = \frac{时钟频率}{CPI \times 10^6}$

用MIPS来度量性能的指标存在三个问题

- MIPS 没有考虑指令的能力，无法比较不同指令集上的计算机
- 不同的程序具有不同的MIPS
- 如果指令数变多，但CPI降低了，那么MIPS的变化是与性能无关的



## 第二章 - 指令：计算机的语言

- 指令集： 一个给定的计算机体系结构所包含的指令集合

### MIPS 架构

Microprocessor without Interlocked Pipeline Stages architecture

特点： 用于高性能服务器， 为RISC精简指令集。

### 一些其他架构

- ARMv7， 与MIPS类似，2011年，ARM处理器芯片产量超过90亿片，成为最流行的指令集
- Intel x86， PC领域和后PC时代的云计算领域占统治地位
- ARMv8， 将ARMv7地址范围由32位扩展到64位， 更加接近MIPS而不是ARMv7

### MIPS操作数

- 32个寄存器(用于数据的快速存取， 只能对存在寄存器的数据执行算术操作)
  - \$s0-\$s7
  - \$t0-\$t9
  - \$a0-\$a7
  - \$v0-\$v7
  - \$zero(恒为0), \$gp, \$fp, \$sp, \$ra, \$at(被汇编器保留，通常处理大的常数)
- $2^{30}$个储存器字(储存器只能通过数据传输指令访问)
  - Memory[0], Memory[4], ... , Memory[4294967292]
  - 使用字节编址，连续的字地址相差4
  - 用于保存数据结构、数组和溢出的寄存器

### MIPS汇编语言

- 算术

| 加法             | add  |
| -------------- | ---- |
| 减法             | sub  |
| 立即数加法（其中一个为常数） | addi |

- 数据传输

| 取字               | lw   |
| ---------------- | ---- |
| 取半字              | lh   |
| 取无符号半字           | lhu  |
| 取字节              | lb   |
| 取无符号字节           | lbu  |
| 取链接字（作为原子交换的前半部） | ll   |
| 取立即数的高位          | lui  |
| 存字               | sw   |
| 存半字              | sh   |
| 存字节              | sb   |
| 存条件字             | sc   |

- 逻辑

| 与    | and  |
| ---- | ---- |
| 或    | or   |
| 或非   | nor  |
| 立即数与 | andi |
| 立即数或 | ori  |
| 逻辑左移 | sll  |
| 逻辑右移 | srl  |

- 条件分支

| 相等时跳转             | beq   |
| ----------------- | ----- |
| 不相等时跳转            | bne   |
| 小于时跳转             | slt   |
| 无符号数比较小于时置位       | sltu  |
| 无符号数比较小于立即数时置位    | slti  |
| 无符号数比较小于无符号立即数时置位 | sltiu |

- 无条件跳转

| 跳转         | j    |
| ---------- | ---- |
| 跳转至寄存器所指位置 | jr   |
| 跳转并链接      | jal  |

### 操作

- 设计原则1： 简单源于规整

操作数的个数一般是一定的

### 操作数

操作数是很严格的

- 必须来自寄存器

MIPS体系中，寄存器大小为32位， 32位一组称为字(word)

- 设计原则2：越小越快

因此寄存器大小限制在32位，期望更多寄存器以及加快时钟周期之间必须做出权衡

还有定长指令的限制

大量的寄存器可能会使得时钟周期变长

一般来说， `$s0, $s1, ...` 表示C和Java程序中**变量**对应的寄存器， `$t0, $t1, ...` 表示程序编译为MIPS指令时所需的**临时寄存器**

- 对齐限制(alignment restriction)  数据地址与储存器的自然边界对齐的要求

  在MIPS体系中，字的初始地址一定是4的倍数(可以加快数据传送)
- 字节寻址类型

  - 大端(big end) 使用最左边的地址作为字地址
  - 小端(little end) 使用最右边的地址作为字的地址

MIPS 使用了大端编址(big-endian)

- load 与 store 指令中的地址是二进制，容量使用二进制表示，如gebibytes($2^{30}$)而不是gigabytes($10^9$)
- 寄存器溢出(spilling)：将不常使用的变量(或稍后再使用的变量)存回到存储器中的过程


MIPS 中偏移量加上基址寄存器的寻址方式非常适合数组和结构，现在存储器容量大大增加，基地址可能会过大而不适合使用偏移量表示

### 二进制

由于字是可以在水平或者垂直的方向上书写，因此使用最左边或最右边表示大小具有不确定性，因此，使用

- 最低有效位(least significant bit, LSB) 表示最右边
- 最高有效位(most significant bit, MSB) 表示最左边

溢出(overflow)： 操作结果不能被最右端的硬件位所表示

有符号数的最终解决方案：二进制补码(two's complement)

二进制补码溢出的时候： 符号位不正确

取数指令对于有符号数与无符号数的处理：

- 取回有符号数，使用符号位填充寄存器的剩余位，称为符号扩展(sign extension)
- 取回无符号数，使用0填充数据左侧的剩余位


其他浮点数表示法： 偏移表示法(biased notation)

通过将数加一个偏移使其具有非负的表示形式

### 指令的表示

指令格式(instruction format)： 指令的布局形式

MIPS的指令，遵循简单源于规整的原则，都是32位长

例： add \$t0, \$s1, \$s2

0 17 18 8 0 32

其中头和尾表示add加法运算，17和18表示s1和s2， 8表示t0

在MIPS中，s0-s7被映射到16-23， t0-t7被映射到8-15

指令的数字形式被称为机器语言(machine language)， 这样的指令序列叫做机器码(machine code)

MIPS字段

R型格式：

| op   | rs   | rt   | rd   | shamt | funct |
| ---- | ---- | ---- | ---- | ----- | ----- |
| 6位   | 5位   | 5位   | 5位   | 5位    | 6位    |

- op： 指令的基本操作，通常称为操作码(opcode)
- rs：第一个源操作数寄存器
- rt：第二个源操作数寄存器
- rd：存放操作结果的目的寄存器
- shamt：位移量(用于位移指令)
- funct：功能，一般称为功能码(function code)，用于指明op字段中操作的特定变式

设计原则3：优秀的设计需要适宜的折中方案

为了保持所有指令长度相同，设计了不同的指令格式，因为5位字段对于寄存器的地址或者某些常数来说太短了

I型字段：

| op   | rs   | rt   | constant or address |
| ---- | ---- | ---- | ------------------- |
| 6位   | 5位   | 5位   | 16位                 |

因此，加立即数指令中的参数也被限制不超过$\pm2^{15}(32768)$

PS: 在这种格式中，就很难设置32个以上的寄存器，因为只有5位的长度。



计算机构建的两个重要原则

- 指令用数的形式表示(使得程序可以被当成二进制文件发行，计算机可以沿用指令集兼容得软件)
- 程序和数一样存储在存储器中，并且可以读写(使得源代码，机器码，文本，编译器可以存储在一起)

存储程序(stored-program)



### 逻辑操作

| 逻辑操作 | C操作符 | Java操作符 | MIPS指令    |
| ---- | ---- | ------- | --------- |
| 左移   | <<   | <<      | sll(逻辑左移) |
| 右移   | \>\> | \>\>\>  | srl(逻辑右移) |
| 按位与  | &    | &       | and, andi |
| 按位或  | I    | I       | or, ori   |
| 按位取反 | ~    | !       | nor       |
| 按位异或 |      |         | xor, xori |

- 移位

R型指令格式中得shamt就是表示移位量(shift amount)

其中的移位(shift)操作都是逻辑移位，即在空出来的位上填充0.

因此左移$i$位就相等于乘以$2^i$

- 按位与(AND)

提供了将源操作数某些位设置为0的能力，后者操作数称为掩码(mask)

andi是与立即数与

- 按位或(OR)

可以将某些为设置为1

ori是与立即数或

- 按位取反(NOT)

为了保持三操作数，因此引入了或非(NOR)，来代替非，NOT(A OR 0) = NOT(A)

没有立即数版本，因为NOT功能是常用的，是单操作数的

- 异或(XOR)



PS: 在和立即数做算数运算时，立即数会进行符号扩展为32位，而和立即数进行逻辑与/或操作时，统一在高16位补0

PS: C语言允许字内定义多个字段，包装在一个字内， 编译器使用and, or, sll, srl等逻辑指令实现



### 决策指令

- 条件分支(conditional branch)指令：先比较两个值，然后根据比较的结果决定是否从一个新的地址开始执行指令
- 避免显式地编写这些标签和分支是使用高级语言的好处之一
- 基本块(basic block)： 没有分支(出现在末尾除外)，并且没有分支目标和标签的指令序列 👌
- MIPS编译器使用slt, slti, beq, bne和固定值0， 来创建所有的比较条件。
- MIPS没有提供小于则分支等指令， 因为过于复杂，会延长时钟周期时间，而且也能用其他两条指令较快地实现
- 对于无符号数，MIPS提供了sltu等相关的指令
- 将有符号数当作无符号数处理，可以来检测下标是否越界。
- 对于switch的实现，可以用if-then-else，也可以用转移地址表(jump address table)或转移表(jump table)，利用MIPS中的jr(jump register)指令实现

### 对过程的支持

过程(procedure)： 根据提供的参数执行一定任务的存储的子程序

过程的步骤：

- 将参数放在过程可以访问的位置
- 将控制转交给过程
- 获得过程需要的存储资源
- 执行需要的任务
- 将结果的值放在调用程序可以访问的位置
- 控制返回初始点

MIPS寄存器的一些约定：

- a0 ~ a3： 用于传递参数的4个参数寄存器
- v0 ~ v1： 用于返回值的两个值寄存器
- ra： 用于返回起始点的返回地址寄存器

跳转和链接指令(jump-and-link instruction)： 跳转到某个地址的同时将下一条指令的地址(返回地址，return address)保存在寄存器ra中

`jal ProcedureAddress`

调用者(caller)： 调用一个过程并提供必要参数的程序

被调用者(callee)： 根据调用者提供的参数执行一系列存储的指令，然后将结果放在寄存器并将控制权返回调用者的程序

程序计数器(program counter， PC) 也称为， 指令地址寄存器(instruction address register)： 保存当前运行的指令的地址。 jal就是将PC+4放入ra中。



#### 使用更多的寄存器

调用者在使用任何寄存器都需要恢复到过程调用前所储存的值，最适合的数据结构就是栈(stack)

栈一般从高地址开始

MIPS中，sp(29)就是专门为栈所准备的寄存器，用来存储栈指针(stack pointer)

寄存器gp，称为全局指针(global pointer) 为了简化静态数据的访问，指向静态数据区

t0-t9， 10个临时寄存器， 过程调用中不必被调用者保存

s0-s7， 8个保留寄存器， 在调用过程中必须被保存(一旦被使用，由被调用者保存和恢复)

这个约定减少了寄存器换出

叶过程(leaf procedure)： 不调用其他过程



| 保留          | 不保留             |
| ----------- | --------------- |
| s0 ~ s7     | t0 ~ t9         |
| sp， 栈指针寄存器  | a0 ~ a3， 参数寄存器  |
| ra， 返回地址寄存器 | v0 ~ v1， 返回值寄存器 |
| 栈指针以上的栈     | 栈指针以下的栈         |

#### 栈(stack)中为新数据分配空间

从高地址到低地址。

包括：保存的参数寄存器， 保存的返回地址， 保存的需要保存的寄存器，局部数组或结构体

栈中包含过程所保存的寄存器和局部变量(局部数组或者结构体)的片段称为过程帧(procedure frame )或活动记录(activation record)

\$fp 帧指针(frame pointer)： 指向该帧的第一个字，因为在过程中栈指针可能会发生改变，那么帧指针就比较有用了。sp还可以通过fp来恢复。提供了一个基址寄存器。

#### 堆(heap)中为新数据分配空间

从低地址到高地址。

包括：保留， 代码段( text segment)， 静态数据段(static data segment)，动态数据(链表之类)

gp寄存器一般指向静态数据段的中间，方便访问。

在c语言中，内存分配由程序控制，可能会导致内存泄漏或者悬摆指针(dangling pointer)

在Java中，使用自动的内存分配和无用单元回收机制



这种内存分配使得堆和栈可以相互增长，达到内存的高效使用。



#### MIPS对寄存器的约定

| 名称          | 寄存器号    | 用途         | 调用时是否保存 |
| ----------- | ------- | ---------- | ------- |
| \$zero      | 0       | 常数0        | 不适用     |
| \$v0 ~ \$v1 | 2 ~ 3   | 计算结果和表达式求值 | ❌       |
| \$a0 ~ \$a3 | 4 ~ 7   | 参数         | ❌       |
| \$t0 ~ \$t7 | 8 ~ 15  | 临时变量       | ❌       |
| \$s0 ~ \$s7 | 16 ~ 23 | 保存的寄存器     | ✔       |
| \$t8 ~ \$t9 | 24 ~ 25 | 更多临时变量     | ❌       |
| \$gp        | 28      | 全局指针       | ✔       |
| \$sp        | 29      | 栈指针        | ✔       |
| \$fp        | 30      | 帧指针        | ✔       |
| \$ra        | 31      | 返回地址       | ✔       |

PS: \$at(1)被汇编器保留，\$k0 ~ \$k1(26 ~ 27) 被操作系统保留

PS: 多于4个的参数默认放在帧指针的上方

PS: 但是帧指针并不是必须的，来自MIPS的C编译器就没有用，而是当成了s8



尾调用(tail call)可以使用尾迭代(tail recursion)高效地优化，消除过程调用的相关开销， 显著提高性能。



### 人机交互

ASCII码(8位)

字符串的表示方法：

- 保留字符串第一个位置为字符串长度
- 附加一个带有字符串长度的变量
- 字符串最后一个位置用特殊字符标识

C中的字符串：使用第三种方法， 用`\0`来表示结尾

Unicode(16位)

Java使用Unicode表示字符串



MIPS软件试图保持栈和字地址的对齐，意味着一个char在栈种被分配到4个字节。

但是C的字符串变量将每4个字节压缩成一个字， Java会把两个半字压缩成一个字



### 32位立即数和寻址

MIPS指令一般只能适用于16位的立即数，因此有了lui指令来操作32位立即数

- lui(load upper immediate) 读取立即数高位：把立即数设置到寄存器的高16位
- ori(立即数或)： 插入低16位立即数。

\$at 就是提供给汇编程序来创建长整数值的寄存器



J型指令：

| 2    | 地址   |
| ---- | ---- |
| 6位   | 26位  |

适用于`j xxxxxx`



由于32位指令的限制，条件分支语句跳转的地址总是不能大于$2^{16}$ ，这是很不现实的。

因此，我们使用`程序计数器 = 寄存器 + 分支地址` 的方法，使得程序大小达到$2^{32}$ 

这种寻址形式称为PC相对寻址(PC-relative addressing)，事实上，PC会提前递增，那么地址就总是相对于PC+4

这种寻址指令是**加速大概率事件**的一个例子

MIPS中所有条件分支使用PC相对寻址



事实上， 并不是所有的跳转指令都是接近调用者的，因此MIPS也会通过跳转和跳转链接指令的J型格式来为过程调用提供长地址

PC相对寻址被设置为加上字的地址而不是字节的地址，因此16位的地址又扩大了4倍，可以表示18位的地址，同样26位的J型格式可以表示28位地址。

但是这样也仅仅是28位，装载器和链接器需要保证程序超过256MB(6400万条指令)，否则需要用jr。



MIPS寻址模式：根据对操作数和/或地址的使用不同加以区分的多种寻址方式的一种

- 立即数寻址(immediate addressing)： 操作数是指令中的参数
- 寄存器寻址(register addressing)： 操作数是寄存器
- 基址寻址(base addressing)或偏移寻址(displacement addressing)： 操作数在内存中，地址是指令中基址寄存器和常数的和
- PC相对寻址(PC-relative addressing)：地址是PC和指令中常数的总和
- 伪直接寻址(pseudodirect addressing)：跳转地址由指令中26位和PC高位相连而成



MIPS和其他指令集可以扩展到64位， 对下一代体系向上兼容



### 并行与指令：同步

互相协作的任务之间的并行需要同步(synchronize)， 否则就有可能发生数据竞争(data race)，导致数据错误。

数据竞争：假如来自不同线程的两个访存请求访问同一个地址，他们连续出现，并且至少其中一个是写操作，那么这两个存储之间形成数据竞争。

同步机制要依赖硬件提供的同步指令，可以由用户调用。

其中最主要的一种方法就是加锁(lock)和解锁(unlock)，采用加锁和解锁可以直接创立一个仅允许单个处理器操作的区域，称为互斥(mutual exclusion)区。

实现同步需要一组硬件原语( hardware primitives)，提供对存储单元进行原子写和原子读的操作。

但是体系结构设计人员希望原语被系统程序员建立同步库(难度较大)，而不是直接使用。

基本方法就是设一个变量，1为占用，0为自由。因为处理器认为他们同时设置同步变量是不可能的

一种可行的方法就是使用指令对。其中第二条指令返回一个标明这对指令是否原子执行的标志值。假如处理器的操作都是在这对指令之前或者之后执行，那么这对指令就是原子的。

在MIPS中，这个指令对就是链接取数(load linked)的特殊取数指令和条件存数(store conditional)的特殊存数指令， 这是两条十分特殊的指令。

```assembly
again:
	addi $t0, $zero, 1 #将t0设置为1
	ll $t1, 0($s1) #原子读，将s1读取到t1中
	# 如果当中存在指令改变了该锁单元的值，下一条指令就会将t0设置为0
	sc $t0, 0($s1) #判断上一条指令t1的读取是否成功，如果成功就将t0设置为1，否则设为0
	beq $t0, $zero, again #如果t0等于0就表示没有成功，重新执行
	add $s4, $zero, $t1 # 把t1读取到的数存入s4
```

以上这个例子就实现了一个s4的值和s1指向的锁单元的值的原子交换的操作(我也不知道为什么叫交换)

可以通过这个指令对来构造其他的同步原语：原子比较和交换(atomic compare and swap)、原子取后加(atomic fetch-and-increment)，只需要在ll与sc之间加一些东西。但是需要注意，任何试图修改锁🔒单元值的操作或者任何异常都会导致sc执行失败，从而导致处理器死锁🔒。所以只能使用寄存器-寄存器指令，而且要尽可能少。



### 翻译和执行程序

程序的生成需要经过编译器、汇编器、链接器，运行则需要加载器

各个步骤有着不同的文件

| C源文件 | 汇编文件 | 目标文件 | 静态链接库 | 动态链接库 | 可执行文件 |
| ---- | ---- | ---- | ----- | ----- | ----- |
| .c   | .s   | .o   | .a    | .so   | .out  |
| .c   | .asm | .obj | .lib  | .dll  | .exe  |



#### 编译器

将C程序转换成汇编语言程序(assembly language program)

#### 汇编器

可以处理一些伪指令(pseudoinstruction)，简化了程序转换和编程

比如

```assembly
move $t0, $t1
add $t0, $zero, $t1
```

MIPS中并不存在move，汇编器可以把他转换成下面的语句

类似的还有blt(branch on less than， 小于则分支)，转换成slt和bne

还能允许将32位常量加载到一个寄存器中而不用考虑指令大小， 也可以识别不同基数的数字

所产生的唯一代价就是保留了一个`$at`给汇编器

而最**主要**的功能：将汇编语言程序转换成目标文件(object file)， 包括机器语言指令，数据和指令正确放入内存所需要的信息。

他使用了符号表(symbol table)来产生二进制表示



UNIX系统的目标文件包括以下内容：

- 目标文件头，描述目标文件其他部分的大小和位置
- 代码段， 包含机器语言代码
- 静态数据段， 包括在程序生命周期内分配的数据。
- 重定位信息， 标记了一些在程序加载进内存时依赖于绝对地址的指令和数据
- 符号表， 包含未定义的剩余标记，如外部引用
- 调试信息， 包含一份说明目标文件如何编译的描述，使得调试器可以将机器指令关联到源文件。

#### 链接器(linker)

也称链接编辑器(link editor)，解决所有未定义的标记，最后生成可执行文件。

为了避免对标准库重新编译的资源浪费，使用链接器将各个模块链接在一起，每次修改只需重新编译指定模块。

工作步骤：

- 将代码和数据模块**象征性地**放入内存
- 决定数据和指令标签的地址，使得所有绝对引用(absolute reference)重定位到真实内存
- 修补内部和外部引用

#### 加载器(loader)

把目标程序装载到内存中以准备运行的系统程序

工作步骤：

- 读取可执行文件头来确定代码段和数据段的大小
- 为正文和数据创造一个足够大的地址空间
- 将可执行文件的指令和数据复制到内存中
- 把主程序的参数(如果存在)复制到栈顶上
- 初始化机器寄存器， 将栈指针指向第一个空位置
- 跳转到启动例程，将参数复制到参数寄存器并调用程序的main函数。当main函数返回时，启动例程通过系统调用exit终止程序

#### 动态链接库

在程序执行过程中才被链接的库例程

最初DLL是链接库中所有在程序运行时可能调用的例程。后来的晚过程链接(lazy procedure linkage)中，例程只有被调用才会被链接。

这是一个技巧。采用了一种间接的方法。以一个非局部例程开始，例程的末尾调用了一组虚例程，每个非局部例程都有一个入口，每个虚入口都包含一个间接跳转。

首先，程序第一次调用库例程的时候，程序首先调用虚入口，然后执行间接跳转， 通过将一个数字放入寄存器来识别所需的库例程，然后跳转到动态链接器或加载器。动态链接器或加载器找到所需的例程，将其重映射并改变间接跳转的地址，使其指向这个例程，那么下次调用这个例程的时候都会间接跳转到这个例程而不用执行中间步骤。

动态链接库仅仅在例程第一次调用的时候开销较大，而且也不需要复制整个库。

#### Java程序的执行

Java具有与C不同的结构，优势在于可移植性，不足在于性能较差。

首先， Java程序会被编译成易于解释的指令序列，Java字节码(Java bytecode)指令集。

然后使用Java虚拟机(Java Virtual Machine， JVM)的软件解释器来执行Java字节码文件。

JVM可以在程序运行的时候，链接Java库中一些需要调用的方法。为了更好的性能，JVM能够调用即时(just in time， JIT)编译器， 在运行的机器上把一些方法编译成本地机器语言。这样一来就可以使得每次的运行将会越快，解释和编译的平衡随着时间的推移逐渐形成。

### 一些性能的问题

对于函数的调用，我们有时候可以通过内联过程(procedure inlining)优化， 但是如果内联过程需要在多个地方调用，编译后的代码就会变多，如果这种代码扩展导致cache的缺失率上升，反而导致性能的下降。

| gcc优化选项  | 相对性能 | 时钟周期(百万) | 指令数(百万) | CPI  |
| -------- | ---- | -------- | ------- | ---- |
| 无        | 1.0  | 158615   | 114938  | 1.38 |
| O1(中等)   | 2.37 | 66990    | 37470   | 1.79 |
| O2(完全)   | 2.38 | 66521    | 39993   | 1.66 |
| O3(过程集成) | 2.41 | 65747    | 44993   | 1.46 |

以上是编译器对于冒泡排序的优化，对于性能，指令数和CPI的影响的比较。

注意到：

- 没有优化的代码具有最好的CPI
- O1具有最少的指令数
- O3具有最快的执行速度

可以得出执行时间是准确衡量程序性能的唯一指标

在与Java的对比中，冒泡排序没有优化的C程序比解释性的Java程序快了8.3倍，但是使用即时优化反而比没有优化的C程序快2.1倍，比最佳优化的C程序慢了1.13倍。但是在快速排序中C程序的优势就远超Java了。



### 数组与指针

在MIPS层面上， 用指针可以省去乘的操作。但是现代的编译器一般都是帮你优化。

使用指针可以获得更好的性能， 但是往往编译器会帮你完成这些优化



### ARMv7(32位)指令集

Advanced RISC Machine

与MIPS主要区别为：ARM有更多的寻址模式(9-3)， MIPS有更多的寄存器(31-15)

ARM没有除法指令

ARM的寻址模式：

- 寄存器操作数
- 立即数操作数
- 寄存器 + 偏移(转移或基地址)
- 寄存器 + 寄存器(下标)
- 寄存器 + 寄存器倍乘(倍乘)
- 寄存器 + 偏移和更新寄存器
- 寄存器 + 寄存器和更新寄存器
- 自增， 自减
- 相对PC的数据

MIPS只有前三种

ARM使用传统的储存在程序中的4位条件码来决定分支是否执行：

- 负值(negative)
- 零(zero)
- 位(carry)
- 溢出(overflow)

特色：

支持一些特殊的算术逻辑指令：循环右移， 寄存器与另一寄存器的非进行与操作， 反向减， 支持多个整数字的加/减

使用了非常新颖的方法解释12位立即数：首先将右侧低8位的有效位填0扩展到32位，然后将所得的数字循环右移， 移动的位数由高4位的值乘以2决定。这种解释方式可以在32位字的范围内表达所有2的幂次。

对储存器组操作提供了指令支持，叫做块加载和存储(block loads and stores)。在指令的16位掩码的控制下， 16个寄存器的任意组合可以被一条指令加载或存储到内存中。这些指令可以保存和恢复程序调用和返回时的寄存器， 也可以被用于存储器块的复制。

### x86指令集

x86受限于兼容性， 一直不断往里面添加指令，体系结构的改变不允许对已有的软件产生任何的危害。

这里介绍的x86是基于80386的32位指令子集

#### 16个寄存器

| 名称   | 长度 | 用途           |
| ------ | ---- | -------------- |
| EAX    | 32   | 通用寄存器0    |
| ECX    | 32   | 通用寄存器1    |
| EDX    |      | 通用寄存器2    |
| EBX    |      | 通用寄存器3    |
| ESP    |      | 通用寄存器4    |
| EBP    |      | 通用寄存器5    |
| ESI    | 32   | 通用寄存器6    |
| EDI    |      | 通用寄存器7    |
| CS     | 16   | 代码段指针     |
| SS     | 16   | 堆栈指针       |
| DS     |      | 数据段指针0    |
| ES     |      | 数据段指针1    |
| FS     | 16   | 数据段指针2    |
| GS     | 16   | 数据段指针3    |
| EIP    | 32   | 指令指针(PC)   |
| EFLAGS | 32   | 条件码(标志位) |

x86指令中一个操作数必须是源操作数又是目标操作数，而且一个操作数可以在存储器中。

还有一些详细的介绍就先跳过了......

### 一些谬误和陷阱

- 更强大的指令意味更高得性能

x86的强大之处就在于可以通过改变前缀来改变后续指令的执行。某个前缀可以重复执行后面的指令直到一个计数器减少至0，但是这样的速度并不是最快的，只是看起来很自然。通过复制代码或者使用浮点寄存器可以达到1.5倍甚至2倍的性能。

- 使用汇编语言来获得最高的性能

如今的编译器生成的汇编一直和汇编工程师的代码性能差不多了，没有必要使用汇编语言编写程序，反而会导致难于维护， 可移植性差，难于调试。

陷阱：

- 在字节寻址的机器中，连续的字地址相差不是1
- 在自动变量定义过程外，使用指针指向该变量，会造成混乱

### MIPS伪指令

| 名称             | 指令  | 格式 |
| ---------------- | ----- | ---- |
| 移位             | move  | R    |
| 乘               | mult  | R    |
| 乘立即数         | multi | I    |
| 取立即数         | li    | I    |
| 小于时跳转       | blt   | I    |
| 小于或等于时跳转 | ble   | I    |
| 大于时跳转       | bgt   | I    |
| 大于或相等时跳转 | bge   | I    |



## 结语

第一二章的内容到此先告一段落。😂

由于我们的老师上课都是讲x86的内容，这本书都放了好久没有看了... 😪

不知道会不会继续更新了...