---
title: Linux | 配置邮件发送系统
date: 2017-09-18 20:32:27
tags: ["Linux","mail"]
categories: "Linux"
---
今天由于某不可抗力因素导致服务器被重装了，幸好没有从删库到跑路，只是violet和xmoj系统还有一系列的服务重新配置一下，以为violet配置成功的时候突然发现邮箱系统没有配置，又没有相关的博客，所以就记录下来，以便以后查看
<!--more-->

## 安装

由于重装了的是centos，实际上感觉也比ubuntu好用，所以用yum安装。这里采用的是msmtp+mutt的配合

msmtp是发送邮件的，mutt实际上只是一个管理工具，两者加起来就可以用起来十分方便了。

```shell
yum install msmtp mutt
```

## 配置

对于邮箱系统的配置，一般是在用户目录下设置配置文件，我们在root文件夹里面新建两个配置文件

```shell
### .muttrc
# msmtp的路径
set sendmail="/usr/bin/msmtp"
set use_from=yes
# 显示的名称
set realname="XMatrix"
# 邮箱地址
set from=xmatrix@zhenly.cn
set envelope_from=yes
```

```shell
### .msmtprc
defaults
account emailaccount
# 邮件服务商提供的smtp服务器
host smtp.exmail.qq.com
# 邮箱地址
from xmatrix@zhenly.cn
auth login
# 用户名
user xmatrix@zhenly.cn
# 密码
password *************
# 日志文件
logfile ~/.msmtp.log
account default: emailaccount
```



## 发送邮件

```shell
# 发送文本内容
echo "文本内容" |　mutt 收件人邮箱@zhenly.cn -s "邮件标题"
mutt 收件人邮箱@zhenly.cn -s "邮件标题" -a /附件地址 </readme.txt
# 发送附件
echo "文本内容" |　mutt 收件人邮箱@zhenly.cn -s "邮件标题" -a /附件地址
# 发送网页内容
cat mail.html |mutt -s "邮件标题" -e 'set content_type="text/html"' 收件人邮箱@zhenly.cn
```

