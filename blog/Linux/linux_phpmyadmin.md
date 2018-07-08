---
title: Linux | phpmyadmin的安装与配置
date: 2017-07-21 21:56:27
tags: ["mysql","php","Linux"]
categories: "Linux"
---
把配置phpmyadmin的过程记录下来，方便日后再次安装

<!--more-->

## phpmyadmin安装

1. 在官网下载 https://www.phpmyadmin.net/downloads/

```shell
wget https://files.phpmyadmin.net/phpMyAdmin/4.7.1/phpMyAdmin-4.7.1-all-languages.tar.gz
```

1. 解压到某个可以访问的目录 

```shell
tar -zxvf phpMyAdmin-4.7.1-all-languages.tar.gz
```

1. 网页进行访问
2. 输入用户密码
3. 基本安装完成

## 需要一个短语密码

1. 修改phpmyadmin根目录下的config_sample.inc.php的$cfg['blowfish_secret']=‘短语密码’
2. 修改libraries牡蛎下的config_default.php的$cfg['blowfish_secret']=‘短语密码’
3. 刷新重新登陆

## 高级功能没有开启

1. 找到phpmyadmin/sql/create_tables.sql 
2. 把这个文件通过phpmyadmin导入到数据库
3. 完成

