---
title: Linux | MongoDB初探
date: 2017-07-21 21:52:27
tags: ["MongoDB","Linux"]
categories: "Linux"
---
之前开发XMOJ的时候用的是MySQL，现在又想了解一下NoSQL的数据库，所以就选取了一个比较流行的MongoDB进行学习

<!--more-->

## 安装并配置MongoDB

从官网下载好`mongodb-linux-x86_64-ubuntu1604-3.4.6.tgz`

*注意： 有时候https的下载速度龟速，可以尝试用http*

然后解压

```shell
tar -zxvf mongodb-linux-x86_64-ubuntu1604-3.4.6.tgz
sudo mv mongodb-linux-x86_64-ubuntu1604-3.4.6 /usr/local/mongo
ln -s /usr/local/mongo/bin/mongo /usr/local/bin/mongo
ln -s /usr/local/mongo/bin/mongod /usr/local/bin/mongod
sudo ./mongod #启动服务进程
mongo #测试服务器
```

安装完成

接下来是配置

配置文件`mangodb.cnf`,放在/data/db下

```
dbpath=/data/db/
logpath=/data/db/mongo.log
logappend=true
fork=true
port=27017
rest=true #非必须
httpinterface=true #非必须
bind_ip = 127.0.0.1 #绑定访问ip
```

ps: rest=true 提供网页端api，可以通过访问 http://localhost:28017/ 查看状态 //非必需



### 启动

```shell
sudo mongod -f /data/db/mongodb.cnf
```

### 关闭

```shell
sudo mongod --shutdown
```

### 检查端口

```shell
netstat -nltp
```

默认27017端口

### 运行、基本操作

```shell
mongo
use admin
db.createUser({user: "admin",pwd: "pwd",roles: [ { role: "userAdminAnyDatabase", db: "admin"}]}) #创建用户管理账号
db.auth("admin","pwd") #用管理员账号登陆
use test #创建并进入一个数据库
db.createUser({user: "zhenly",pwd: "zhenly",roles: [ { role: "readWrite", db: "test"}]}) #为当前数据库创建一个具有写入权限的账号
db.auth("zhenly","zhenly") #使用刚才创建的账号登陆
db.test.insert({"name":"test"}); #插入一条数据
db.test.find() #显示数据库的数据
```

创建管理员后在配置文件加上`auth=true`来**开启认证**

### 登陆操作

1. `db.auth('username','password')`
2. `$ mongo -u username -p password`





## 用户管理说明

创建用户：

```
use test
db.createUser({user: "zhenly",pwd: "zhenly",roles: [ { role: "readWrite", db: "test"}]})
```

更新用户：

```
db.updateUser('zhenlys',{pwd:'zhenly',roles:[{role:'readWrite',db:'test'}]})
```

删除用户

```
db.dropUser('zhenly')
```





## MongoDB中用户的角色说明

### read

数据库的只读权限

### readWrite

数据库的读写权限和**read**的所有权限

### dbAdmin

```
clean,collMod,collStats,compact,convertToCappe create,db.createCollection(),dbStats,drop(),dropIndexes ensureIndex()，indexStats,profile,reIndex renameCollection (within a single database.),validate 
```

### userAdmin

数据库的用户管理权限

### clusterAdmin

集群管理权限(副本集、分片、主从等相关管理)，包括：

```
addShard,closeAllDatabases,connPoolStats,connPoolSync,_cpuProfilerStart_cpuProfilerStop,cursorInfo,diagLogging,dropDatabase 
shardingState,shutdown,splitChunk,splitVector,split,top,touchresync 
serverStatus,setParameter,setShardVersion,shardCollection 
replSetMaintenance,replSetReconfig,replSetStepDown,replSetSyncFrom 
repairDatabase,replSetFreeze,replSetGetStatus,replSetInitiate 
logRotate,moveChunk,movePrimary,netstat,removeShard,unsetSharding 
hostInfo,db.currentOp(),db.killOp(),listDatabases,listShardsgetCmdLineOpts,getLog,getParameter,getShardMap,getShardVersion 
enableSharding,flushRouterConfig,fsync,db.fsyncUnlock()
```

### readAnyDatabase

任何数据库的只读权限(和read相似)

### readWriteAnyDatabase

任何数据库的读写权限(和readWrite相似)

### userAdminAnyDatabase

任何数据库用户的管理权限(和userAdmin相似)

### dbAdminAnyDatabase

任何数据库的管理权限(dbAdmin相似)

### __system

什么权限都有