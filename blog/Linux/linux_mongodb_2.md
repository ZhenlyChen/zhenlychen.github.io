---
title: Linux |  MongoDB学习笔记-基本操作与索引
date: 2017-08-10 21:47:27
tags: ["MongoDB", "学习笔记","Linux"]
categories: "Linux"
---

之前学了MongoDB的安装和建立用户等基本运维操作，今天来学一下具体的增改删除等操作以及索引的建立与使用

<!--more-->

## 一些基本操作

### 显示列表

```
show dbs
show tables
show collections
```

### 插入数据

```
db.test.insert({x : 1})
```

系统将在test集合下生成一个数据格式为{"_id": ObjectId("xxxxxx"), "x" : 1}的json记录

- `_id` 也可以自己自己指定，但是同一个集合下不能重复
- 也可以使用js语法创建数据(比如for循环)

### 查询数据

```
db.test.find({x : 1})
db.test.find({n : {$exists:true}})
# 查找存在n字段的记录
```

- 通过find()可以查看集合下所有数据
- .count()可以返回满足查询条件的数据数目
- .skip(x) 可以跳过x条数据
- .limit(x) 可以限制返回x条数据
- .sort({x:1}) 对x进行顺序排序再返回数据

### 更新数据

```
db.test.update({x : 1, y : 1},{x : 2})
#更新后数据{x : 2}
db.test.update({x : 1, y : 1},{$set:{x : 2}})
#更新后数据{x : 2, y : 1}
```

$set[部分内容更新符]：更新存在的数据，不修改其他数据

```
#假设不存在{x : 1}的数据
db.test.update({x : 1},{x : 2})
#数据库没有任何变化
db.test.update({x : 1},{x : 2},true)
#数据库多出{x : 2}的记录
```

update的第三个参数为是否在查询不到记录时插入新数据

- update 每次只会更新一条数据

更新多条数据的方法：

```
de.test.update({x : 1}, {$set:{x : 2}},false, true)
```

- 当第四个数据为true的时候第二个参数只允许使用$set操作符，防止误操作多条数据

### 删除数据

```
db.test.remove({x : 1})
db.test.drop() # 删除整个集合
```

- romove函数不允许限定条件为空(即删除整个集合)

## 索引

### 索引种类与使用

- _id 索引
  - 系统默认索引
  - 系统自动生成的唯一字段
- 单键索引
  - 最普通的索引
  - 索引值为单一的值，如字符串，数字，日期
- 多键索引
  - 索引值为多个记录，如数组
  - 创建方法同单键索引
- 复合索引
  - 查询条件不止一个的时候适用
- 过期索引,又称 TTL(Time To Live)索引
  - 一段时间后会过期的索引
  - 过期后数据被删除
  - 适合储存临时的用户登陆信息，日志
  - 索引值必须为ISODate格式，不能使用时间戳
  - 若索引为数组，则按照最小的时间删除
  - 不允许建立复合索引
  - 删除时间有+-60s的误差
- 全文索引
  - 适合适用于文章的内容和标题搜索
  - 代替正则匹配之类的复杂操作
  - 对中文的支持还不太好
  - 每个集合只能创建一个全文索引
  - 每次查询只能指定一个$text
  - 全文查询的$text不能与nor、hint一起用
- 地理位置索引
  - 点的位置
  - 分类
    - 2d索引-平面
    - 2dsphere索引-球面
  - 查找方式
    - 距离某个点一点距离的点
    - 包含在某区域内的点

### 查询集合的索引情况

```
db.test.getIndexes()
```

- 当数据量过大，而且没有相应的索引，查询有可能会不返回结果

### 创建单键索引

```
db.test.creatIndex({x:1}) 
#对x进行正向排序创建索引
db.test.creatIndex({x:-1})
#对x进行逆向排序创建索引
```

- 最好在使用数据库使用之前将索引创建完毕，否则会影响数据库的性能
- 影响：减慢插入性能，大幅度提高读取性能

### 创建复合索引

```
db.test.creatIndex({x:1, y:1}) 
```

### 创建过期索引

```
db.test.creatIndex({x:1}, {expireAfterSeconds:10}) 
# 10秒后过期
```

### 创建全文索引

```
db.test.creatIndex({x:"text"})
对x创建全文索引
db.test.creatIndex({x:"text", y:"text"})对x与y创建全文索引
db.test.creatIndex({"$**":"text"})
对test集合所有字段创建全文索引
```

### 使用全文索引

```
db.test.find({$text:{$search: "aa"}})
# 查询aa这个单词的记录
db.test.find({$text:{$search: "aa bb"}})
# 查询aa或bb的记录
db.test.find({$text:{$search: "aa -cc"}})
# 查询 aa 而且 非cc 的记录
db.test.find({$text:{$search: "\"aa\"" "\"bb\""}})
# 查询 aa 与 bb 的记录
db.test.find({$text:{$search: "aa bb"}},{score:{$meta:"textScore"}})
# 返回每条记录附加相似度
db.test.find({$text:{$search: "aa bb"}},{score:{$meta:"textScore"}}).sort({score:{$meta:"textScore"}})
#对相似度进行排序后返回
```

### 索引属性

- 名字
  -  name
- 唯一性
  - unique:true/false
  - 是否允许插入同一索引的记录
- 稀疏性
  - sparse: true/false
  - 默认不稀疏
  - 稀疏：不为不存在的字段创建索引
- 是否定时删除（过期索引）
  - expireAfterSeconds

```
db.test.creatIndex({x:1},{设置属性})
```

### 强制使用索引查询

```
db.test.find({x : 1}).hint("m_1") # 强制使用m_1作为索引查询
```

### 创建平面地理位置索引

```
db.test.creatIndex({w: "2d"})
#创建平面地理位置索引
#格式：[经度，纬度]
#取值范围：经度:[-180,180],纬度:[-90,90]
```

### 平面地理文字索引查询

- $near查询：查询距离某个点最近的点
- $geoWithin查询： 查询某个形状内的点
  - $box 矩形 
    - {￥box:[[x1,y1],[x2,y2]]}
    - 左上角与右下角
  - $center 圆形 
    - {$center:[[x1, y1],r]}
    - 圆心与半径
  - $polygon 多边形 
    - {$polygon: [[x1,y1],[x2,y2],[x3,y3]]} 
    - 各个点

```
db.test.find({w:{$near:[1,1]}})
# 默认返回一百个
db.test.find({w:{$near:[1,1]},$maxDistance:10})
#限制最远距离为10
db.test.find({w:{$near:[1,1]},$maxDistance:10,$minDistance:3})
#限制最远距离为10,最近距离为3
db.test.find({w:{$geoWithin:{$box:[[0,0],[3,3]]}}})
# 查询矩形[0,0][3,3]中的点
db.test.find({w:{$geoWithin:{$center:[1,1],1}})
# 查询以[1,1]为圆心，半径为1的圆中的点

```

- 还有geoNear查询方法，可以查询更多的数据，详情就去看文档吧

### 索引构建情况分析

- 优点： 加快查询
- 缺点： 增加磁盘占用，降低写入性能
- 评判工具
  - mongostat工具
  - profile集合
  - 日志
  - explain分析

