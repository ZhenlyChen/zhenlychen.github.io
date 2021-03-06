---
title: 读书笔记 | 数据库管理系统原理与设计 - 事务管理
date: 2018-07-07 23:02:00
tags: ["读书笔记", "数据库"]
categories: "Book"
---

大二下学期课程，记录一下学习的重点和笔记。🐷

本文内容包括事务管理概述、并发控制和崩溃恢复。

这些是本书的第五个部分，属于比较深入到数据库内部的部分，要求具有一定的数据库知识。

<!--more-->

## 事务管理概述

事物的主要特点：并发执行，并且在系统发生故障时能进行恢复

### ACID属性

事务应该具有下面四个主要特性:

- A - 原子性(Atomicity)：所有操作要么全部被执行，要么都不被执行。不存在不完全的事务。
- C - 一致性(Consistency)：每个单独执行的事务，在不和其他事务并发执行情况下，都具有一致性
- I - 隔离性(Isolation)：事务都是独立的，不受来自其他并发调度的事务的影响
- D - 持久性(Durability)：一旦事务完成，即使发生了故障，结果也能永久保持住。



#### 一致性和隔离性

一致性：提交事务的用户必须确保事务执行完毕时仍保持数据库实例处于“一致”的状态

隔离性：当若干事务交叉执行时，实际处理结果和按照某种串行顺序执行事务相同。



#### 原子性和持久性

事务未正常结束的原因:

- 执行时产生某些异常，被DBMS终止，以失败结束
- 一个或多个事务正常处理时系统发生崩溃
- 事务处于某种非预期状态（如读到不正常数据、不能访问磁盘）而决定终止

DBMS通过取消未完成的事务保证事务的原子性，将对数据库的所有写操作记录在日志里。日志也能用于确保持久性。



### 事务和调度

事务可以看作一个操作系列或者队列，包括对数据库对象的读和写操作

$R_T(O)$: 事务T读数据对象O的操作

$W_T(O)$: 事务T写数据对象O的操作

$Commit_T$: 成功提交

$Abort_T$: 终止并取消所有已执行的修改操作



两个重要假设

- 事务之间之只能通过数据库的读写操作进行交互， 它们之间不能交换信息
- 数据库是独立对象的固定的集合



调度时某个事务集合对应的一个操作（读、写、提交、中止）列表，并且两个来自同一个事务T的操作必须和原来在T中的次序相同。

一个调度表示的是实际或者潜在的执行顺序。

完全调度： 调度中包括每个事务的**中止**或者**提交**操作

串行调度：事务**一个接一个**地开始执行一直到结束



### 事务的并发执行

#### 并发执行的动机

- 减少磁盘和CPU的空闲等待时间
- 增加系统的吞吐量
- 减少事务的平均执行时间

#### 可串行化

调度执行的结果对应的数据库实例和按照某种**串行顺序执行**这些事务得到的结果相同。

不可串行化的原因:

- DBMS使用的并发控制方法采用的调度本身不是可串行化的，但等价于某种可串行化调度
- SQL允许某些应用程序执行DBMS采用不可串行化的调度

#### 交叉执行带来的异常

##### 读未提交的数据(WR冲突)

事务T2读已经被另一个事务T1修改但还没偶提交的数据库对象A， 这种读称为**脏读**

##### 不可重复的读(RW冲突)

当事务T1读数据对象A， 并仍在运行时， 事务T2修改了A的值。

##### 重写未提交的数据(WW冲突)

当T1已经修改了数据对象A，并仍在运行时， T2重复写入A的值。这种写称为**盲写**

存在更新丢失的问题。

#### 包括中止事务的调度

**可串行的调度**的定义：如果事务集合S的一个调度执行的结果和S的所有提交事务构成的的某个**完全串行调度**执行的结果相同，那么该调度称为可串行化调度。

定义依赖于：已终止事务的所有操作都可以反做。

一个**可恢复**的调度要求：

如果一些事务读了另一些事务修改了的数据，那么他们的提交必须放在另一些事务的提交之后， 如果事务**仅仅读已提交事务修改的数据**，那么这个调度不但使可恢复的，而且也可以在中止一个事务时不用再中止其他事务。这种调度称为避免了**级联中止**。

取消事务可能带来的问题：

假设事务T2重写已经被事务T1修改的数据对象A，此时T1仍在运行，但随后就中止了。T1所有对数据库对象的修改将会被反做， 恢复为修改之前的值。但T1以这种方式中止，即使提交了事务T2，那么T2进行的修改也会丢失。

可以使用一种**严格的2PL(strict 2PL)**技术来防止这类问题的发生。

### 基于加锁的并发控制

DBMS一般使用加锁协议来确保只运行可串行化的可恢复的调度，并且再取消中止事务时，已提交事务的所有事务都不会丢失。

#### 严格的两阶段加锁

严格的2PL，具有以下两个规则：

- 如果事务T希望读（或修改）某个数据对象，那么应该首先申请一个该对象的共享（或排他）锁
- 事务结束时，其拥有的所有的锁都会被释放。

严格2PL只允许可串行化调度

#### 死锁

等待锁释放的事务循环被称为死锁

常用的方法时检测并解除死锁

发现死锁的一个简单的方法是超时机制，当一个事务为某个锁等待的时间过长，那么可以悲观认为是死锁循环并终止。

### 加锁的性能

加锁使用两种机制：

- 阻塞(blocking)[极端情况为死锁]
- 终止(aborting)

都涉及一个性能上的损失。

存在一个点，当再增加一个事务数的时候会导致吞吐量的下降，这个新增加的事务被阻塞并与现存的事务竞争或阻塞现存的事务，我们称系统在这一点**失败**。

当活动事务30%被阻塞，失败一般就会发生

增加吞吐量的方法：

- 对最小可能的对象加锁
- 减少一个事务持有锁的时间
- 减少热点（一个进程被访问或修改的数据库对象，并会导致大量的阻塞延迟）

### SQL对事务的支持

#### 创建和结束事务

创建：用户执行一个访问数据库和目录的语句时候，如SELECT, UPDATE, CREATE TABLE

结束：COMMIT命令或ROLLBACK(终止)命令

SQL中支持长事务的特性：

`savepoint`：允许指定事务中的一点，并在这一点后选择性地执行回滚操作

```sql
SAVEPOINT <name>
ROLLBACK TO SAVEPOINT <name>
```

链事务(chained transaction)：可以在提交和回滚一个事务之后立即初始化另一个事务

使用`AND CHAIN` 关键字

#### 应该锁住什么

不同粒度

幻影问题：一个事务查询一组对象两次，即使它自己没有改变任何元组，但是看到是不同的结果

需要加锁解决

#### SQL中事务的特性

SQL控制事务引起的锁的开销的模式：

- 访问模式(access mode)
- 诊断尺度(diagnostics size)：记录错误情况的个数
- 隔离级别(isolation level)：控制了某一给定的事务暴露在其他并发执行的事务动作中的程度

### 崩溃恢复简介



#### 偷帧和强制写页

写对象操作会带来两个问题：

- 在事务T提交前，是否需要将T对对象O的修改从缓冲池写回磁盘？另外的事务调入时，而缓冲管理程序决定替换存有O的界面时，就需要写。如果允许，就称作采用了偷帧(Stealing Frame)方法。
- 事务提交时，确保事务在缓冲池对数据对象进行的所有修改立即存盘，称为强制写页(Forcing Page)

不偷帧、强制写页的恢复管理程序更为简单

大多数使用偷帧和非强制写页，更加快。

|        | 非窃取 | 窃取           |
| ------ | ------ | -------------- |
| 非强制 | 重做   | 快、重做、反做 |
| 强制   | 慢     | 反做           |



## 并发控制

### 2PL、可串行性和可恢复性

调度的冲突等价：

- 两个调度包括相同的事务操作
- 它们发生冲突操作对在调度中的次序相同

调度后对数据库具有相同的的结果

冲突可串行的调度：

- 一个调度冲突等价于某个串行调度

也就是说串行中的顺序等于并发执行的顺序

每个冲突可串行的调度也是可串行化的。



**优先图**（依赖图）可以获取调度中事务间所有冲突，也称为可串行图。

一个调度S的优先图包括：

- 对于S中每个提交的事务用一个节点来表示
- 如果$T_i$先执行，并且和$T_j$的某个操作发生冲突，那么应存在一条从$T_i$到$T_j$的边



严格的2PL只允许进行可串行化调度

- 调度S是冲突和串行的，当且仅当其优先图中不会存在回路
- 严格的2PL保证其允许的所有调度优先图中都不包含回路



变种：两阶段加锁(2PL)，允许事务在结束前释放锁。



Lock Compatibility Matrix 锁兼容矩阵

|      | S    | X    |
| ---- | ---- | ---- |
| S    | ✔    | ❌    |
| X    | ❌    | ❌    |

两阶段封锁：分为请求锁和释放锁两个阶段

保证冲突可串行化，但是不保证级联终止。

严格两阶段封锁（事务结束时候才释放锁）可以保证级联终止。



对于某个调度，如果一个事务写入的值在其提交或者终止之前没有其他事务读或者重写，那么就称这个调度是**严格**的。



#### 观测可串行化

冲突可串行化可串行化的充分但非必要条件

具有相同事务集合的两个调度S1和S2观测等价：

- $T_i​$在S1中读对象A的初始值，在S2中也必须读对象A的初始值
- 如果在S1中$T_i$读的式$T_j$写入对象A的值， 那么在S2中$T_i$也必须读$T_j$写入对象A的值
- 对于一个数据对象A， 如果在S1中执行了最后一个对A的写操作，那么在S2中也必须执行最后一个对A的写操作

### 加锁管理简介

锁管理器维护一个锁表（一个以数据对象标识为码的哈希表）

DBMS在事务表中每个事务中包含一个指向事务拥有锁列表的指针，请求锁前需要检查这个列表。

锁表中的信息：

- 拥有某个数据对象锁的事务数目
- 锁的字样属性
- 一个指向加锁请求队列的指针

#### 实现加锁和解锁请求

按照严格的2PL

共享锁和互斥锁有不同的操作

#### 加锁和解锁的原子性

需要使用系统的同步机制来原子地加锁和解锁

#### 护卫、闭锁

设置闭锁可以确保物理读写使原子操作

DBMS对事务的调度和操作系统对进程访问CPU调度的相互影响会出现护卫现象，大多数CPU周期都在进程切换上。



### 锁转换

使用锁的升级不能避免由冲突更新操作导致的死锁

一种更好的方法时不适用锁升级

### 死锁处理

DBMS必须周期性地检查死锁

锁管理器通过维护一个**等待图**来检测死锁循环

等待图：

- 图中的节点对应正在处于执行状态的事务
- 当且仅当$T_i$等待$T_j$释放锁时，存在一条$T_i$到$T_j$的边

定期检查等待图中是否存在表明死锁的回路

#### 死锁预防

赋予每个事务一个优先权值，并保证低优先权的食物不用等待高优先权事务，可以预防死锁

可以使用时间戳作为优先值

冲突处理策略：

- 等待-死亡策略：如果$T_i$的优先权高，则等到$T_j$结束，否则中止$T_i$
  - 低优先权的事务永远不会等待高优先权的事务
  - 非抢先
- 受伤-等待策略：如果$T_i$优先权高，中止$T_j$，否则$T_i$等待
  - 高优先权的事务永远不会等待低优先权的事务

保守的2PL也可以预防死锁

要求在事务开始执行时，需要获得事务的所需的所有锁

### 特殊的加锁技术

#### 动态数据库和幻影问题

严格的2PL能够保证冲突可串行化

如果新的数据项加入到数据库中，那么冲突可串行化不能保证为可串行化

处理幻影问题：

- 如果没有索引，那么T1需要对所有页加锁，并且不允许新的页加入到文件
- 如果由一个索引，那么可以获取所有特定数据项的索引的锁，称为索引锁

#### B+数的并发控制

直接方法：忽略索引结果，直接将每个页看作一个数据对象，并采用某个版本的2PL

简单的加锁策略回导致对树的高层节点的锁频繁争夺

注意:

- 树的高层只用于直接搜索，所有数据存于叶子层
- 插入时，如果更新的叶节点发生分裂并传播上去，那么对于上层节点也必须加锁。保守的加锁策略可能需要获得所有节点的互斥锁。称为锁耦合或crabbing

对于兄弟节点：在分离一个叶子节点时，新的节点必须加到这个叶子节点的左边，否则兄弟节点的指针必须修改的节点为另一个。

#### 多粒度锁

除了共享锁（S）和互斥锁（X）外，还有准备共享锁（IS）和准备互斥锁（IX）

IS仅和X有冲突，IX和S和X有冲突。

如果事务需要对某个节点加S锁，那么需要先对所有子孙系欸但加IS锁

SIX锁：等同于同时持有S锁和IX锁

锁兼容矩阵

|      | IS   | IX   | SIX  | S    | X    |
| ---- | ---- | ---- | ---- | ---- | ---- |
| IS   | ✔    | ✔    | ✔    | ✔    |      |
| IX   | ✔    | ✔    |      |      |      |
| SIX  | ✔    |      |      |      |      |
| S    | ✔    |      |      | ✔    |      |
| X    |      |      |      |      |      |



### 不加锁的并发控制

乐观的并发控制方法：

思想： 尽可能允许事务执行

事务执行的阶段：

- 读
- 验证：提交时检查是否会发生冲突，如果存在，事务中止，清空工作区并重新启动
- 写

验证阶段，对于任意的$TS(T_i) < TS(T_j)$ 两个事务，以下条件之一必须满足（保证$T_j$更新的结果对$T_i$不可见）

- $T_i$在$T_j$ 开始执行前已经结束所有三个阶段
  - 允许$T_j$看到$T_i$更新的结果，但是他们是串行的
- $T_i$在$T_j$开始执行$T_j$的写阶段前已经结束，并且$T_i$没有写任何$T_j$读的数据对象
  - 允许$T_j$在$T_i$正在修改对象时读某些数据对象，但是没有读被修改过的对象
- $T_i$ 在 $T_j$ 结束读阶段前已经完成了自己的读阶段，并且不写任何$T_j$读或写的数据对象
  - 允许同时写操作，但是写对象没有任何交集





#### 基于时间戳的并发控制

对每个数据库对象给定一个读时间戳`RTS(O)` 和一个写时间戳`WTS(O)`。

当事务T希望写对象O时：

- TS(T) < RTS(O)， 写操作和对象O最近的读操作发生冲突，需要中止并重启事务T
- TS(T)< WTS(O),  可以忽略（被称为Thomas写规则）
- 写对象O，将WTS(O) 设为 TS(T)

这个协议并不能保证时可恢复的



#### 多版本并发控制

对于每个数据对象维护具有不同写时间戳的若干版本，并允许事务$T_i$读取时间戳在$TS(T_i)$之前最新的版本



## 崩溃恢复

DBMS事务管理器保证事务的原子性和持久性

- 通过取消未完成事务的所有操作保证事务的原子性
- 通过保证已提交事务的操作在系统崩溃和介质故障时仍然有效来获得事务的持久性

### ARIES算法简介

ARIES是一个窃取、非强制的并发控制方法相结合的恢复算法

恢复数据库的三个阶段：

- 分析：识别缓冲池中的脏页和崩溃时当前事务
- 重做(redo)：从日志的某个适合的点开始，重复所有的操作，将数据库恢复到崩溃时所处的状态
- 反做(undo)：取消没有提交的事务的操作，使数据库只反映已提交事务的操作结果

三个基本原理：

- 写优先日志法(Write-ahead logging): 任何对数据库对象的修改首先写入日志
- 重做时重复历史
- 恢复修改的记录数据：反做某些事务时，如果出现对数据库的改变需要写入日志，确保在重复崩溃时不需要重复这些操作。

### 日志

trail或journal

是DBMS对其所执行操作的历史记录，保存在稳定存储中

每个日志记录，都有一个唯一标识：日志顺序码(log sequence number, LSN)

数据库中的每一页都应该包含日志中对该页进行最后一个更新的记录的LSN，称为pageLSN

需要写入日志的操作：

- 更新一页
- 提交
- 中止
- 结束
- 反做一个更新：当事务回滚时，事务已经进行的更新需要被取消，然后写入**补偿日志记录CLR(compensation log record)**

每条日志记录都有：

- preLSN：可以快速获取前一条记录
- transID：存储生成日志记录的事务的标识
- type：表明日志记录的类型

**更新日志记录**

pageID：被修改页的标识

length：更新长度

offset: 更新开始的偏移量

before-image: 更新前数据值

after-image：更新后数据值

**补偿日志记录**

CLR包含一个称为`undoNextLSN`的字段，表示下一个需要反做操作的日志记录的LSN。

CLR描述的是一个永远不会被反做的操作



### 与恢复相关的其他数据结构

- 事务表：每个当前事务的
  - 事务标识
  - 状态
  - 最近日志记录的LSN，称为lastLSN
- 脏页表：
  - recLSN：引起该页变脏的第一个日志记录的LSN（第一个需要重做的日志记录）



### 写优先日志协议

WAL是确保系统从崩溃中进行恢复时所有更新日志记录都可用的最主要规则



#### 检查点

时对DBMS状态的一个快照，可以减少崩溃中进行恢复的工作量。

ARIES方法设检查点的三个步骤：

- 写入标识检查点开始的begin_checkpoint记录
- 构造end_checkpoint记录，包括事务表和脏页表的当前内容，并添加到日志中
- 在end_checkpoint记录写入稳定存储后开始：将特殊记录master（包括begin_checkpoint的LSN）写入稳定存储

最后得到事务表和脏页表内容保持在begin_checkpoint记录时的内容

这种检查点称为模糊检查点

当系统从崩溃中恢复时，重启过程从最近的检查点记录开始处理。

### 从系统崩溃中恢复

三个阶段：

- 分析阶段
- 重做阶段
- 反做阶段

#### 分析阶段

- 确定从日志中开始重做的起点
- 找出系统崩溃时缓冲池的脏页（一般为超集）
- 确定出崩溃时正在执行，现在必须取消的事务

分析工作正向扫描日志，直到日志的结尾：

- 如果事务T具有“结束”的日志，那么将T从事务表删除
- 如果T没有结束，那么就需要把T的条目添加到事务表中
  - lastLSN设为该日志的LSN
  - 如果日志时commit，那么就把状态设置为C，否则为U(反做)
- 如果出现对页P产生影响并且能够重做的操作，那么就把P加入脏页表中
  - recLSN设置为改日志的LSN

#### 重做阶段

重新执行所有事务的更新操作，包括已提交或者处于其他状态的事务

重做阶段从脏页表中最小的`recLSN`的日志记录开始，向前正向扫描日志到结尾。

不需要重做的情况：

- 受影响的页没有出现在脏页表中
  - 表示该页的所有更新已经写入磁盘
- 受影响的页在脏页表中，但是该数据项的recLSN比正在检查的日志记录的LSN要大
  - 表示更新操作已经写入磁盘
- 对某个页面检索，获得它的pageLSN，而这个pageLSN大于或等于正在检查的记录的LSN
  - 保证更新页已经写入磁盘

最后，将所有状态为C的事务从事务表删除，并且日志中写入这些事务的最末记录。

#### 反做阶段

从日志的最后向前扫描，取消崩溃时正在执行事务的所有更新操作。

**反做算法**

失败事务(loser transaction)：崩溃时正在执行的事务，所有操作必须按照日志中出现的相反的顺序取消

所有失败事务的`lastLSN`值的集合，称为`ToUndo`，取消时，反复从这个集合选择最大的LSN值开始处理，直到`ToUndo`为空

处理步骤:

- 如果记录为CLR，并且`undoNextLSN`不为空，则将`undoNextLSN`添加到集合`ToUndo`，如果`undoNextLSN`为空，那么就表示反做工作已经完成。日志中写对应事务的最末记录， 丢掉CLR
- 如果事务为更新记录， 写入CLR并反做相应更新操作，并且把更新日志记录的`preLSN`添加到集合`ToUndo`

**重新启动时的崩溃**

CLR保证对于更新的日志记录只需执行一次。

中止一个事务只是反做操作的一个特例

### 介质恢复

基于定期生成的数据库副本

当数据库对象损坏，需要使用最近的副本，通过日志识别并重做已提交事务的更新操作



### 其他算法以及与并发控制的交互作用

其他算法在反做之后，重做非失败事务的操作， 并且回滚所有失败事务的操作。



## 结语

以上就是一些数据库事务部分的知识，对于接下来的部分，有空会继续写下去的。
