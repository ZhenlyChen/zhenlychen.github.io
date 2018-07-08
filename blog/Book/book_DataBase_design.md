---
title: 读书笔记 | 数据库管理系统原理与设计 - 数据库基础
date: 2018-04-02 20:35:00
tags: ["读书笔记", "数据库"]
categories: "Book"
---

大二下学期课程，记录一下学习的重点和笔记。🐷

本文内容包括数据库系统概述、 实体联系模型、关系模型、关系代数和演算、SQL：查询、约束与触发器

这些都只是这一本书的第一个部分，只是很简单的数据库基础知识，但是对于数据库的学习是非常重要的。

<!--more-->

## 概述

数据库是数据的集合，用于描述一个或多个相关组织的活动。

一个数据库包括：

- 实体
- 实体间的联系

数据库管理系统（Database management system, DBMS）

### 管理数据

- 数据库设计和应用程序开发
- 数据分析
- 并发性和稳健性
- 有效性和可伸缩性

### 文件系统和数据库管理系统

DBMS对于文件系统的优势：

- 可以直接操作大数据
- 不同用户并发存取数据，保护数据的一致性
- 系统崩溃时，确保数据恢复到一致的状态
- 允许不同用户有存取不同数据子集的权限的安全策略

### DBMS的优点

- 数据独立性
  - 把应用代码与数据细节分开
- 有效的数据存取
- 数据完整性和安全性
- 数据管理
- 并发存储和故障恢复
- 减少应用程序开发时间

对于严格实时约束的应用程序以及灵活的文本数据分析就不太适合使用DBMS

### 数据的描述和储存

**数据模型（data model）**是隐藏了许多低级存取细节的高级数据描述结构的集合。

**语义数据模型（semantic data model）**是一种更抽象的高级数据模型。

**实体-联系（ER）模型**是一个广泛使用的予以数据模型。

#### 关系模型

关系模型的核心数据描述结构是**关系**（relation），可以被认为是 **记录**（record）的集合。

基于数据模型的数据描述称为**模式**（schema）

关系模型中一个搞关系的模式需要说明这个关系的名字， 每个字段（属性attribute或列）的名字及每个字段的类型

**完整性约束**是关系中的记录必须满足的条件。

其他数据模型：

- 层次模型
- 网状模型
- 面向对象模型
- 对象 - 关系模型


#### 数据库管理系统的抽象级别

数据库由以下三种抽象模式组成

磁盘 \<-> 物理模式 \<-> 概念模式 \<-> 外模式

数据定义语言(data definition language, DDL) 用于定义外模式和概念模式

- 概念模式，Conceptual Schema(又称逻辑模式)
  - 以DBMS数据模型的形式描述存储的数据
  - 获得好的概念模式的过程称为**概念数据库设计**(conceptual database design)
- 物理模式， Physical Schema
  - 描述存储细节， 概念模式中关系在二级存储设备上实际是如何存储的
  - 物理模式基于数据存取特点的
  - 获得好的物理模式的过程称为**物理数据库设计**
- 外模式， External Schema
  - DBMS的数据模型， 为单个用户和用户组定制(和授权)数据存取
  - 任何给定的数据库拥有一个概念模式和一个物理模式，但是可以有多个外模式
  - 外模式的记录可以在必要的时候计算出来


#### 数据独立性 Data Independence

当数据的结构和存储方式发生变化时，应用程序不受影响。

如果概念模式发生变化，外模式可以重新设计保证可以计算出相同的关系

- 逻辑数据独立性： 用户能够免于因数据逻辑结构变化或关系的存储的选择变化的影响(外模式\<->概念模式)
- 物理数据独立性： 概念模式把用户与数据物理存储的变化分开(概念模式\<->物理模式)

### 数据库管理系统中的查询

查询(queries)： 针对DBMS中存储的数据的提问

查询语言(query language)： 一种DBMS提供的专门的语言

关系演算(Relational calculus)： 基于数理逻辑形式的查询语言

关系代数(Relational algebra)： 基于能操纵关系的操作集合的查询语言

数据操纵语言(data manipulation language， DML) 可以创建， 修改和查询数据，插入，删除和修改数据的结构。查询语言只是DML的一部分。

DML和DDL嵌入到宿主语言(C 或者COBOL)， 称为数据子语言(data sublanguage)

Non-Procedural Query Language:

SQL(structured Query Language)

### 事务管理 

Transaction Management

- 当很多用户并发存取， DBMS必须能处理这些请求以避免冲突，如果不允许用户并发存取数据库会降低数据库的性能
- DBMS必须保护用户免于系统故障的影响。当系统崩溃后重新启动，所有数据能恢复到一致的状态

事务(transaction)： DBMS中用户程序的任何一次执行，时DBMS的基本修改单元。

#### 事务的并发执行

DBMS的一个重要任务就是进行数据的并发存取调度

**加锁协议** (locking protocol)是每一个事务需要遵循的规则集合。

锁是一种用来控制对数据库对象进行存取的机制：

- 共享锁(shared lock)[读取]：可以由不同事务同时获取
- 互斥锁(exclusive lock)[修改]：确保没有其他事务能获取该对象上的任何锁

#### 未完成的事务和系统崩溃

DBMS必须将那些由未完成事务产生的数据修改重数据库删除。

DBMS要维护一个记录所有数据库写操作的日志。



先写日志(Write-Ahead Log， WAL)： 每个写操作必须在进行**之前**先记录在日志上。

**因此DBMS必须能够有选择性地强制将内存中的一页写入磁盘上。**

日志也可以用来确保一个成功完成的事务所发生的数据库的改变不会因为系统的崩溃而丢失。



DBMS必须确保所有先于崩溃前完成的事务结果能够得到恢复，所有未完成事务的结果需消除。

**因此可以通过周期地，强制地将一些信息写进磁盘，可以减少系统崩溃恢复所要的时间，这个周期性的操作称为检查点(checkpoint)** ， 这个周期需要平衡，因为过于频繁会影响系统的正常执行速度。



### 数据库管理系统的结构

查询 ->查询优化器(query optimizer) -> 执行计划(execution plan)

关系操作的实现代码位于**文件和存取方法层**(file and access methods layer)之上，这一层支持文件存储结构

文件和存取方法代码位于**缓冲区管理器**(buffer manager)之上，缓冲区管理区负责把页从磁盘取入主存以响应读请求。

最底层处理存储着数据和磁盘空间管理，称为**磁盘空间管理器**(disk space manager)



与并发控制和恢复有关的构件：

- 事务管理程序：加锁与释放锁， 调度事务的执行
- 锁管理器： 跟踪对锁的请求
- 恢复管理程序： 维护日志

### 与数据库打交道的人

终端用户：

- 使用由数据库应用开发者开发的应用程序

数据库应用开发者：

- 通过外模式存取数据

数据库管理员(DBA)：

- 概念和物理模式的设计
- 安全性和授权
- 数据可用性和故障恢复
- 数据库调优



## 实体联系模型

实体-联系(ER)数据模型

### 数据库设计与ER图

数据库设计过程：

- 需求分析
  - 哪些数据需要存储
  - 哪些应用建立在上面
  - 哪些操作是频繁的
  - 性能要求
- 概念数据库设计
- 逻辑数据库设计
- 模型的细化
- 物理数据库设计
- 应用与安全设计



#### ER图

- 实体集：矩形
- 属性：椭圆
- 主码：下划线
- 部分码：虚线
- 值域：列在属性名的旁边
- 联系集： 菱形
- 码约束（映射约束）：箭头
- 参与约束：粗细线条
- 子类：三角形
- 聚合：虚线框
- 弱实体：粗线矩形
  - 识别联系集：粗线菱形
  - 之间的联系：粗线箭头



### 实体、属性和实体集

实体(Entity)： 客观世界的一个对象，可以区别与其他对象

实体集(Entity Set)：实体的集合

属性：实体通过一组属性来描述的，一个实体集的所有实体具有相同的属性。每个相关的属性都必须确定值域。

码(Key)：一组最小的属性的集合，可以唯一确定实体集中的每个实体。

候选码(Candidate key)

主码(Primary Key)：可能存在多个候选码， 指定一个作为主码



### 联系和联系集

- 联系是两个或多个实体之间的一种关联，相似的联系在一起，组成联系集。
- 联系集也可以具有描述性属性

联系集可以是二元、三元或是多元的

参与一个联系集的实体集可以是不同也可以是相同的。

一般同一个实体的联系集具有角色（role）属性（写在连线的旁边）



### ER模型的其他特征

#### 码约束 Key Constraints

也称映射约束，在ER图中用箭头表示，方向由N指向1，表示每个实体只对应一个的关系

表明一个`1 to N` 的关系，比如每个部门只有一个经理，但是一个雇员可以作为多个部门的经理。

如果加上“每个雇员最多只能管理一个部门”，那就形成了`1 to 1`的联系集

#### 参与约束 Participation Constraints

“每个部门都要求有一个经理”就是一个参与约束，ER图中用粗线表示

那么这个联系集就成为 `完全的` ，否则就是`部分的（partial）`

通俗来说，就是是否实体集中每一个对象都有一个对应的联系。

#### 弱实体 Weak Entities

没有可区分的属性（主码）的实体，必须依赖与另一实体集（**识别属主**， identifying owner）的关联。只有（部分码）

限制：

- 识别属主和弱实体集必须参与一个“一对多”的联系集，这个联系集成为这个弱实体的识别联系集， identifying relationship（箭头表示）
- 弱实体集在联系集中必须是全部参与的（粗线表示）

而且关系集和实体集都要要粗线的菱形和矩形。

#### 类层次 Class Hierarchies

对实体集中的实体进行分类，分类后**继承**父实体集的属性，另外也有自己的属性

- 将父实体集进行细化（Specialization）成子类，细化就是一个标识某个实体集（超类）的子集的过程
  - 先定义超类，接着定义子类，同时加上子类的属性和相应的联系
- 将子实体集进一步泛化（Generalization）为父类，泛化的过程一般是：先标出实体型之间的公共特征，然后生产一个新的具有这些公共特征的实体集。
  - 先定义子类，接着定义超类，包括定义超类的相应联系

根据ISA(is a, 表示父子关系的类层次)的结构可以指定两种约束，即交迭（overlap）约束和覆盖（covering）约束。

交迭约束：决定是否允许两个子类含有相同的实体。默认实体集之间不存在交迭。

覆盖约束：决定了子类中的实体是否包括超类中的所有实体，默认情况下是不包括的。

标识子类有两个基本原因（通过特殊化和泛化）：

- 想要键入一个描述属性，只对于实体中一个子集有意义。
- 想要标识参与一些联系的实体集

#### 聚合 Aggregation

聚合允许一个联系集（用一个虚线框标识）参与另一个联系集。

当需要在几个联系中表达一个联系时，就需要使用聚合。

有时候聚合可以用三元联系替代，需要一定的完整性约束来指导。



### 用ER模型进行概念数据库设计

设计ER图关注的问题：

- 应该将概念模型化为实体还是属性？
  - 一般来说可以再分的作为实体，不可再分的作为属性。
- 应该将概念模型化为实体还是联系？
  - 一般动词作为联系，名词作为实体
- 联系集及其参与的实体集有哪些？应该使用二元联系还是三元联系？
- 是否使用聚合

#### 实体与属性

需要建立一个实体集而不是属性的情况：

- 每个记录对应多个记录（需要用实体）（原子性原则）
- 需要捕捉实体信息的结构，即需要从实体来查询对应的记录的时候。这个东西需要细分，提供细节的查询，则需要使用实体（因为属性的不可分的）

在一些模型的版本中，属性的值可以为集合，但是关系模型不支持这种具有集合取值的属性，当我们将这种集合属性转化为关系模型的时候，与把这个属性看作一个实体比较类似。



#### 实体与联系

- 如果联系中标识的信息比较复杂，则需要使用实体来表示
- 一个联系中的某个属性如果需要累计计算的话，则需要使用实体来表示这个联系。
  - 这个实体作为本身关系的中间者，使用两个联系连着本来的两个实体

ER模型的不精确性可能会导致某些潜在的实体能以被识别，而且，我们可能将属性与联系相关联，而不是与适当的实体相关联。这样的错误通常就会导致数据冗余。

#### 二元与三元联系

二元联系：

- 对于一些具有一对多的约束，需要使用二元联系来表示。
- 如果存在弱实体集，那么需要使用二元联系来表示。

三元联系：

- 例如供应商、部门、零件之间的联系（合同）， 需要一个三元联系才能准确表示
- 需要清楚描述联系（合同）之间的属性

#### 聚合与三元联系

主要看是否存在一个使联系集和实体集（或另一个联系集）相关联的联系。

当联系和实体之间存在某些一对多的约束，那就需要使用聚合来表示。



### 大型企业的概念数据库设计

- 考虑各种用户的需求，解决那些有冲突的需求，并在最后需求分析阶段生成一个全局需求集
- 对于不同的用户群生成不同的概念模式，然后在集成这些概念模式

### 统一建模语言

UML， unified modeling language

包含了更广泛的软件设计过程：

- 业务建模
- 系统建模
- 概念数据库建模
- 物理数据库建模
- 硬件系统建模



图表：

- 用例图， Use case：描述用户相应用户请求的系统行为，以及该行为中涉及的人。描述期望系统支持的外部功能。
- 活动图， Activity： 显示业务处理过程中的行为流。
- Statechart图： 描述系统对象之间的动态交互
- 类图， Class：类似ER图，不过更一般化。



## 关系模型

SQL(Sequel), Standard language

### 关系模型简介

Table： Relation

Row: Tuple

Column: Attribute

> 数据库由一个或多个关系共同组成， 每个关系是行和列组成的表。

关系：用于描述数据的主要结构

关系数据库：关系的集合。

构成：

- Relation Schema 关系模式： 关系名， 每个字段(列或属性)的名字，每个字段的域。
- Relation Instance 关系实例
  - `#rows`：Cardinality 基：该关系实例具有记录的数目
  - `#fields` : arity  源(or degree 度) ：字段的数目

关系数据库：具有不同关系名的关系 的集合

关系数据库模式：数据库中关系模式的集合

域约束：

一个关系模式可以表述成`R(f1:d1,...,fn:dn)`， `Domi`表示域`di`相应的取值集合

$\{<f_1,d_1,...,f_n:d_n>|d_i\in Dom_i,...,d_n\in Dom_n\}$

- `<...>`给出记录的字段
  - 例如`<sid:5000,name:Dave,login:dave@cs, age:19, gpa:3.3>`
- `{..}` 代表一个集合
- `|` 表示需要满足， 右边的表达式是每条记录的字段值必须满足的要求
- $\in$ 表示属于

#### 使用SQL创建和修改关系

数据定义语言（Data Definition Language， DDL）：支持创建，删除，修改关系表的SQL子集

创建一个关系表

```sql
CREATE TABLE Students(sid	CHAR(20),
                      name	CHAR(30),
                      login	CHAR(20),
                      age	INTEGER,
                      gpa	REAL)
```

插入记录

```sql
INSERT 
INTO 	Students(sid, name, login, age, gpa)
VALUES	(53688, 'Smith', 'smith@ee', 18, 3.2)
```

删除记录, S为Students的别名

```sql
DELETE
FROM 	Students S
WHERE	S.name = 'Smith'
```

更新已有数据的字段值

```sql
UPDATE	Students S
SET		S.age = S.age + 1, S.gpa = S.gpa - 1
WHERE	S.sid = 53688

UPDATE	Students S
SET		S.gpa = S.gpa - 0.1
WHERE	S.gpa >= 3.3
```



### 关系的完整性约束

> Integrity Constraint， IC ，完整性约束：数据模型的重要组成部分。

#### 码约束

用`UNIQUE`语句将关系表的某些字段集合声明为候选码，最多一个可以通过`PRIMARY KEY`声明为主码

`CONSTRAINT` 命名一个约束，当违反约束时，会返回约束名，用于定位错误。

```sql
CREATE TABLE Students ( sid		CHAR(20),
                      	name	CHAR(30),
                      	login	CHAR(20),
                      	age		INTEGER,
                      	gpa		REAL,
                      	UNIQUE	(name, age),
                      	CONSTRAINT	StudentsKey PRIMARY KEY(sid))
```

#### 外码约束

一个表的外码必须指定另一个表的主码

外码也可以指向本关系。

也可以用特殊值`null`处理

```sql
FOREIGN KEY(sid) REFERENCES Students
```

#### 一般约束

- 取值范围约束
- 主码约束
- 外码约束

一般约束由数据库系统以表约束或者断言的形式支持的，当一个表修改时，需要检查其他表是否违反约束。

### 完整性约束的强制执行

ON DELETE/UPDATE:(在删除/更新时)

- ON ACTION: 违反约束时操作被拒绝执行
- CASCADE: 当外键绑定的记录被删除，那么对应的记录也会被删除。当外键绑定的记录的主键被修改，那么对应的外键也会被修改
- SET DEFAULT: 当外键绑定的记录被删除，相应的记录会重新指向一个默认的记录
- SET NULL: 同上，被设置为NULL

例如：

```sql
FOREIGN KEY (sid) REFERENCES Students,
			ON DELETE CASCADE,
			ON UPDATE NO ACTION
```

#### 事务与约束

约束可以在事务执行时检查约束，也可以在事务执行完才检测。

```sql
SET CONSTRAINT ConstraintFoo DEFERRED
```

- DEFERRED: 推迟 :alarm_clock:
- IMMEDIATE: 立即执行  :ok_hand:



### 查询关系数据

> 数据访问、存取机制、 查询语言

```sql
SELECT	*
FROM	Students S
WHERE	S.age < 18
```

S 为Students的重命名

```sql
SELECT	S.name, S.login
FROM	Students S
WHERE	S.age < 18
```

通过Select可以选取记录的部分字段值。

```sql
SELECT	S.name, E.cid
FROM	Students S, Enrolled E
WHERE	S.sid = E.sid AND E.grade = 'A'
```

可以将两个表组合起来查询。

### 逻辑数据库设计：从ER模型到关系模型

#### 从实体集到关系表

```sql
PRIMARY KEY (ssn)
```

说明主码

#### 从联系集（不包括约束）到关系表

- 参与实体的主码属性，作为外码字段
- 联系集的描述属性作为一个属性
- 联系集中的非描述属性集可以作为关系的超码，如果联系集没有码约束，那么这个属性集就成为一个候选码。
- 当外码的字段名和被应用的字段名称不同时，需要明确给出被引用字段名

```sql
FOREIGN KEY(supervisor_ssn) REFERENCES Employees(ssn)
```

#### 转换带码约束的联系集

在具有一对多关系中，可以用“一”的实体作为联系集的主码。

也可以把该实体集与联系集都写入一个关系表中。

#### 转换带有参与约束的联系集

带有参与约束的联系集，一般外码都是`NOT NULL` 

如果不使用SQL提供的表约束和断言功能，许多参与约束都无法表达。

一般为保证参与约束，我们可以通过将某个值设为指向另一个表的外码来得到，但是这个外码如果不是那个表的候选码，那么就不是一个合法车外码约束。

因此我们需要使用断言，要求某一个表的某个值必须都出现在另一个表的某个记录中，并且另一个表的这个值不允许为空。

#### 转换弱实体集

一般与联系集联合成一个关系表

#### 转换类层次

有两种方法：

- 映射成不同的关系，子关系包含父类关系的主码
- 只为子类创建不同的关系

#### 转换带聚合的ER图

创建一个关于聚合和联系的关系，包含三者的主码和联系的属性。

### 视图简介

生成一个视图：

```sql
CREATE VIEW B-Students (name, login, course) -- 如果忽略括号里的就继承字段名
		AS	SELECT	S.sname, S.sid, E.cid
			FROM	Students S, Enrolled E
			WHERE	S.sid = E.sid AND E.grade = 'B'
```

#### 视图、数据独立性和安全

通过使用视图定义外部模式中的关系，可以对应用隐藏数据库概念模式的变化

为用户提供某些定义视图，可以隐藏某些信息

#### 视图的更新

视图可以适应用户对数据库的不同需求。

通过修改原来的关系的数据来修改视图

### 删除/ 修改 关系表和视图

向关系`Students`添加一个字段`maiden-name` ：

```sql
ALTER TABLE Students
		ADD COLUMN maiden-name CHAR(10)
```

添加后其值为`null`

通过`ALTER TABLE` 也可以向删除字段，添加或删除该表上的完整性约束。



## 关系代数和演算

SQL语言：parse（编译）-> 关系代数

利用关系演算，查询只需要描述说要的答案而不需要指出答案是如何找出来，这种非过程化的形式是说明性的（declarative）。是形式化的查询语言。



### 预备知识

查询的输入和输出都是关系，对输入的实例进行求值，同时产生出输出关系的一个实例。

- 使用字段名指示字段（更加易读）
- 按照统一的循序列出给定关系的所有字段，通过相对位置引用字段（更加方便，不必为所有中间关系实例指定名字）



### 关系代数

关系的本质就是集合。

关系代数是与关系模型相关的两种形式化查询语言之一。

代数的过程化特性使得能够将关系代数表达式看成是查询求值的处方或计划

关系系统就是使用代数表达式来表示查询求值计划的。

五大基本操作符

- Selection： 选择行的一个子集（水平）
- Projection： 投影列（垂直）
- Cross-product： 把两个关系进行组合
- Set-difference：集合的差，Tuples in r1， but not in r2
- Union：Tuples in r1 or in r2.



#### 选择与投影

$\sigma _{rating>8} (S2)$

选择条件是项的布尔组合， 通常为 `属性 op 常量` 或 `属性1 op 属性2` ， 对属性的引用可以通过位置或名字。

$\pi _{sname, rating} (S2)$

$\pi$ 是默认去重的（集合里面没有重复元素），可以使用扩展关系代数保留重复

可以混合使用$\pi _{sname, rating} （\sigma _{rating>8}(S2))$



#### 集合操作

两个关系要相容：

- Same number of fields。 相同的字段数
- ‘Corresponding’ fields have the same type. ，从左到右，相应的字段取值范围相同

上面的定义并没有使用字段名，如果是$R \bigcup S ​$ 默认从R继承名字



集合标准操作：

- 并（union）$\bigcup$
  - $R \bigcup S$返回一个包含关系实例R或者S中的所有元组的关系实例.
- 交（intersection）$\bigcap$
  - $R \bigcap S = R - (R-S)$
- 差（set-difference）$-$
- 叉积，笛卡儿积（ross-product）$\times$



#### 重命名

$\rho (R(\overline {F}),E)$ ， 可以将任意一个关系代数表达式`E`变成一个新的关系实例`R`

$\overline {F}$ 是项的列表，其形式为 $oldname \rightarrow newname$ 或 $position \rightarrow newname$



#### 连接

合并两个或多个关系是信息。可以定义为先叉积，在进行选择和投影。

##### 条件连接

$S1 \bowtie  _{S1.sid < R1.sid} R1$

##### 相等连接

$S1 \bowtie  _{S1.sid = R1.sid} R1$

##### 自然连接

$S1\bowtie R1$

规定R和S的所有同名字段都相等，省略连接条件，如果没有想吐的属性，就相当于叉积。实际上是一个相等连接



#### 除

$A/B = \pi _x (A)-\pi _x ((\pi _x (A) \times B) - A)$

关系A只有字段x和y，B只有字段y

除操作定义为如下所有x的集合：对面B中每个元组y，在A中都有一个<x,y>与之对应



#### 优化

原则：总是先做选择。



### 关系演算

关系代数是过程化的，关系演算是非过程化的或是说明性的。

关系演算的变形 

- **元组关系运算** （Tuple Relational Calculus， TRC）， 变量以关系的元组为值。
- **域关系演算** （Domain Relational Calculus， DRC）， 变量以关系中的字段取值范围为值。




#### 元组关系演算 TRC


$\{T \ |\  p(T)\}$

T: 元组变量

p(T): 描述T的公式



##### TRC查询的语法

原子公式：

- $R \in Rel$
- $R.a \ op \ S.b$
- $R.a \ op \ constant, or \ constant \ op \ R.a$

递归定义为以下形式：

- 任何原子公式
- $\overline{p}, p \bigvee q, p \bigwedge q, p \Rightarrow q$
- $\exists R(p(R)), R是元组变量$
- $\forall R(p(R)), R是元组变量$


如果公式没有被一个量词限定，那么该变量是自由的。

$\{T \ |\  p(T)\}$， 其中T就是公式p中唯一的自由变量

- $\exists R \in Rel(p(R))$ 表示 $\exists R (R\in Rel \bigwedge p(R))$
- $\forall R \in Rel(p(R))$ 表示 $\forall R (R \in Rel \Rightarrow p(R))$



#### 域关系演算 DRC

一个域变量的取值范围就是某个属性的取值范围。

形式：

$\{<x_1, x_2,...,x_n> |\  p(<x_1, x_2,...,x_n>)\}$

类似TRC, 把集合换成具体的字段名字，属性用对应的名字代替。



### 代数与演算的表达能力

表达能力是相同的





## SQL： 查询、约束与触发器

### 概述

两种子语言

- DML， 数据操作语言：数据查询，插入，删除，修改
- DDL， 数据定义语言：表和视图的创建、删除、修改，权限

特性：

- 触发器
- 高级完整性约束
- 嵌入式：从宿主语言调用SQL代码
- 动态SQL：允许在运行时构建查询
- 客户-服务器执行和远程数据库存取
- 事务管理
- 安全保证
- 高级特性：面向对象特性、递归查询、决策支持查询。


### 基本SQL查询形式

基本查询形式

```sql
SELECT [DISTINCT] select-list
FROM	from-list
WHERE	qualification

SELECT	S.sname
FROM 	Sailors S, Reserves R
WHERE	S.sid = R.sid
```

`DISTINCT`: 结果不包含重复的行



#### Select 命令中的表达式和字符串

```sql
SELECT 	S.age-5 AS age1, S.age*2 AS age2 -- 计算列
FROM	Sailors S
WHERE	S.sname='dutin'

SELECT 	S1.sname AS name1, S2.sname AS name2
FROM	Sailors S1, Sailors S2
WHERE	2*S1.rating = S2.rating - 1

SELECT 	S.age
FROM	Sailoors S
WHERE	S.sname LIKE 'B_%B'
```

`%`: 代表0个或多个字符

`_`: 只代表任意一个字符

`LIKE`： 对于空格敏感

`collation`（整序）：针对字符集，用户可以指定哪个字符比其他字符小，提供灵活的字符串操作



### UNION、INTERSECT和EXCEPT

三种集合操作符（大多数系统只支持UNION）

- UNION：并集
- INTERSECT：交集
- EXCEPT：减

其他集合操作符：

- IN: 检查一个元素是否在给定的集合中。
- op ANY
- op ALL: 将一个值与给定集合中的元素用比较操作符op进行比较
- EXISTS： 检查一个集合是否为空
- NOT: 取反


`UNION` 默认去掉重复行，使用`UNION ALL`保留重复行

`INTERSECT` 默认保留重复行

`EXCEPT` 默认保留重复行

### 嵌套查询

```SQL
SELECT 	S.sanme
FROM	Sailors S
WHERE 	S.sid IN (SELECT 	R.sid
                  FROM		Reserves R
                  WHERE		R.bid=103)
```

#### 相关嵌套查询

```SQL
SELECT 	S.sname
FROM	Sailors S
WHERE	EXISTS(SELECT	*
               FROM		Reserves R
               WHERE	R.bid=103
              			AND R.sid=S.sid)
```

#### 集合比较操作

```SQL
SELECT	S.sid
FROM	Sailors S
WHERE 	S.rating > ANY (SELECT 	S2.raing
                        FROM	Sailors S2
                       	WHERE	S2.sname='Horatio')
```

`>= ALL` : 表示最高

`IN` 和 `NOT IN ` 与`=ANY` 和`<>ANY` 等价



`ORDER BY column [ASC|DESC]`: 排序

### 聚集操作符

- `COUNT([DISTINCT] A)` : A列中所有（不同）值的数目
- `SUM([DISTINCT] A)` : A列中所有（不同）值的总和
- `AVG([DISTINCT] A)`: A列中所有（不同）值的平均值
- `MAX(A)`: A列中的最大值
- `MIN(A)`: A列中的最小值

#### GROUP BY 和 HAVING 子句

```SQL
SELECT [DISTINCT] select-list
FROM from-list
WHERE qualification
GROUP BY grouping-list
HAVING group-qulification

-- 对于每个等级，找出最年轻的水手的年龄
SELECT 		S.rating, MIN(S.age)
FROM		Sailors S
GROUP BY 	S.rating
```

`HAVING` 决定了给定分组是否产生一个结果行



### 空值

#### 使用空值的比较

比较操作符：

`IS NULL`

`IS NOT NULL`

#### 逻辑连接运算 AND、OR和NOT

一旦有了空值，那么需要使用true, false, unknown 表示逻辑连接运算的结果

#### SQL构造符的作用

当记录中含有空值的话， 一些数学操作符都将返回空，但是使用一些聚集操作符，空值可能会引起一些预料不到的行为。

`COUNT(*)` 像其他值一样处理空值

`COUNT, SUM, AVG, MIN, MAX, DISTINCT` 只是简单地抛弃空值。

#### 禁止使用空值

定义的时候指定`NOT NULL` 

### SQL中的复杂完整性约束

#### 单个表上的约束

`CHECK`

每次修改都会运行CHECK里面的语句检查是否为真

#### 域约束与DISTINCT类型

```SQL
CREATE DOMAIN ratingval INTEGER DEFAULT 0
			 CHECK (VALUE > 1 AND VALUE <= 10)
			 
CREATE TYPE ratingtype AS INTEGER
```

#### 断言： 多个表上的完整性约束

当一个约束涉及到多个表的时候，使用断言就是最适合的方法了。它可以与表分离开来，不会因为表为空而失效。

```sql
CREATE ASSERTION smallClub
CHECK(( SELECT COUNT (S.sid) FROM Sailors S)
     + (SELECT COUNT(B.bid) FROM Boats B)
     < 100)
```

### 触发器和主动数据库

触发器是一个过程，它对数据库的特定改变进行相应，并由DBMS自动调用。

一个触发器包括以下三个部分：

- 事件： 激活触发器的数据库改变
- 条件：当触发器被激活时运行的查询或检测
- 动作：当触发器被激活且条件为真时，DBMS要执行的过程


例子（Oracle Server语法）

```sql
CREATE TRIGGER init_count BEFORE INSERT ON Students /* Event */
	DECLARE
		Count	INTEGER;
	BEGIN			/* Action */
		Count := 0;
	END
	
CREATE TRIGGER incr_count AFTER INSERT ON Students /* Event */
	WHEN (new.age < 18)
	FOR EACH ROW
	BEGIN	/* Condition; 'new' is just-inserted tuple */
		Count := count + 1;
	END

CREATE TRIGGER set_count AFTER INSTER ON Students	/* Event */
REFERENCING NEW TABLE AS InsertedTuples
FOR EACH STATEMENT
	INSERT
		INTO StatisticsTuple (ModifiedTable, ModificationType, Count)
		SELECT 'Student', 'Insert', COUNT *
		FROM InsertedTuples I
		WHERE I.age < 18
```

### 设计主动数据库

#### 为什么触发器难以理解

因为如果一条语句触发多个触发器，那么的触发顺序是不可预测的

#### 约束和触发器

触发器一般用于维护数据库的一致性，应该优先考虑使用完整性约束（如外码约束）

触发器可以更灵活地维护数据的完整性



## 结语

以上就是一些数据库基础知识，对于接下来的部分，有空会继续写下去的。
