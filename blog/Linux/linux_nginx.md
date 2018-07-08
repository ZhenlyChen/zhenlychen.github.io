---
title: Linux | Nginx和PHP7的安装与配置
date: 2017-07-21 21:57:27
tags: ["Nginx","php","Linux"]
categories: "Linux"
---
由于经常配置服务器，然后最主要的就是nginx，所以这个学期以来我配置nginx已经不下五次了，所以记下来以便以后方便地安装

<!--more-->

由于我们要使用http2，首先我们需要openssl的最新版本,然后nginx的安装也依赖与pcre和zlib

```shell
tar -zxvf openssl-1.1.0g.tar.gz
tar -zxvf pcre-8.41.tar.gz
tar -zxvf zlib-1.2.11.tar.gz
```

如果你是纯净的系统，那么编译之前还要安装cc等一系列的环境

```shell
# Ubuntu
apt-get install build-essential
apt-get install libtool
#CentOS
yum -y install gcc automake autoconf libtool make
yum install gcc gcc-c++　　
# 或者 一次性安装一大堆
yum groupinstall "Development Tools" 
```

然后要下载nginx的安装包并安装

```shell
wget http://nginx.org/download/nginx-1.13.2.tar.gz
tar -zxvf nginx-1.13.2.tar.gz
./configure --with-pcre=../pcre-8.41 --with-zlib=../zlib-1.2.11 --with-openssl=../openssl-1.1.0g  --with-stream --with-stream_ssl_module --with-http_ssl_module --with-http_v2_module --with-threads --with-http_flv_module --with-http_addition_module --with-http_mp4_module --with-http_gzip_static_module
make
sudo make install
sudo ln -s /usr/local/nginx/sbin/nginx /usr/local/bin/nginx
```

到此已经安装完毕

接下来是配置文件，一下是一个安全性比较高的https+http2配置

```
user www-data www-data;
worker_processes  auto;

error_log  logs/error.log;
error_log  logs/error.log  notice;
error_log  logs/error.log  info;

pid        logs/nginx.pid;


events {
    use epoll;
    worker_connections  1024;
    multi_accept on;
}


http {
    include mime.types;
    default_type application/octet-stream;
    server_names_hash_bucket_size 128;
    client_header_buffer_size 32k;
    large_client_header_buffers 4 32k;
    client_max_body_size 1024m;
    client_body_buffer_size 10m;
    sendfile on;
    tcp_nopush on;
    keepalive_timeout 120;
    server_tokens off;
    tcp_nodelay on;

    fastcgi_connect_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_read_timeout 300;
    fastcgi_buffer_size 64k;
    fastcgi_buffers 4 64k;
    fastcgi_busy_buffers_size 128k;
    fastcgi_temp_file_write_size 128k;
    fastcgi_intercept_errors on;

    #Gzip Compression
    gzip on;
    gzip_buffers 16 8k;
    gzip_comp_level 6;
    gzip_http_version 1.1;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_vary on;
    gzip_types
        text/xml application/xml application/atom+xml application/rss+xml application/xhtml+xml image/svg+xml
        text/javascript application/javascript application/x-javascript
        text/x-json application/json application/x-web-app-manifest+json
        text/css text/plain text/x-component
        font/opentype application/x-font-ttf application/vnd.ms-fontobject
        image/x-icon;
    gzip_disable "MSIE [1-6]\.(?!.*SV1)";

    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;

    server{
        listen 443 ssl http2 default_server;
        server_name my.zhenly.cn;
        ssl on;
        ssl_certificate /usr/local/nginx/conf/ssl/1_my.zhenly.cn_bundle.crt;
        ssl_certificate_key /usr/local/nginx/conf/ssl/2_my.zhenly.cn.key;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES256-GCM-SHA384:AES128-GCM-SHA256:AES256-SHA256:AES128-SHA256:AES256-SHA:AES128-SHA:DES-CBC3-SHA:HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4';
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;

        add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload" always;
        add_header X-Frame-Options SAMEORIGIN always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options nosniff;

        location / {
            root   /usr/local/nginx/html;
            #index  index.html index.htm;
        }
        location /api/ {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_set_header X-NginX-Proxy true;
            proxy_pass http://127.0.0.1:30002/;
            proxy_redirect off;
        }
        location /content/ {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_set_header X-NginX-Proxy true;
            proxy_pass http://127.0.0.1:30001/;
            proxy_redirect off;
        }
        location ~ [^/]\.php(/|$) {
            fastcgi_pass  127.0.0.1:9000;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root/$fastcgi_script_name;
            include       fastcgi_params;
        }
        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|ico)$ {
            expires 30d;
            access_log off;
        }
        location ~ .*\.(js|css)?$ {
            expires 7d;
            access_log off;
        }
        location ~ /\.ht {
            deny all;
        }
    }
}
```

## 配置php7.0

这里使用apt-get的方式安装

```shell
sudo apt-get install php7.0
sudo apt-get install php7.0-cgi
sudo apt-get install php7.0-curl
sudo apt-get install php7.0-mbstring
```

然后修改一下配置文件

```shell
cd /etc/php/7.0/fpm/pool.d/
sudo vim www.conf
```

然后修改

```
listen = /run/php/php7.0-fpm.sock
```

为

```
listen = 9000
```

然后启动php-fpm

```
sudo php-fpm7.0
```

再来说一下如何编译安装php最新版(CentOS7)

```shell
# 下载最新版php
wget http://hk1.php.net/get/php-7.1.11.tar.gz/from/this/mirror
tar -zxvf php-7.1.11.tar.gz
./configure --prefix=/usr/local/php --with-config-file-path=/usr/local/php/etc  --with-curl --with-freetype-dir --with-gd --with-gettext --with-iconv-dir --with-kerberos --with-libdir=lib64 --with-libxml-dir --with-mysqli --with-openssl --with-pcre-regex --with-pdo-mysql --with-pdo-sqlite --with-pear --with-png-dir --with-xmlrpc --with-xsl --with-zlib --enable-fpm --enable-bcmath --enable-libxml --enable-inline-optimization --enable-gd-native-ttf --enable-mbregex --enable-mbstring --enable-opcache --enable-pcntl --enable-shmop --enable-soap --enable-sockets --enable-sysvsem --enable-xml --enable-zip
# 一般会提示缺少库的用yum -y install 安装便是
# 例如我需要安装openssl-devel、libxml2-devel、curl-devel、libpng-devel、freetype-devel、 libxslt-devel
# 或许是我选择的模块太多了吧，然后就是非常漫长的make了
make
make install
#成功后需要复制配置文件php.ini 和php-fpm.conf www.conf
#从源码包复制php.ini

cp php.ini-development /usr/local/php/etc/php.ini

#在执行文件时  加上 --with-config-file-path=/usr/local/php/etc 可以指定php.ini的位置

cd /usr/local/php/etc/  
# 进入这个目录

cp php-fpm.conf.default php-fpm.conf  
#添加php-fpm.conf 配置文件

cd php-fpm.d  
#在进入这个目录

cp www.conf.default www.conf   
#添加www.conf，这个文件是phpfpm的端口号等信息，如果你修改默认的9000端口号需在这里改，再改nginx的配置，ps：php5.X版本是直接在php-fpm.conf这个文件配置，没有这个文件的

#进入php-fpm.conf 这个文件把 ;pid = run/php-fpm.pid 前面的;去掉，我编译php5版本是，发现启动php没有php-fpm.pid这个文件，导致不能重启，后面发现把这个打开，启动就能生成php-fpm.pid这个文件了

#启动php

/usr/local/php/sbin/php-fpm

#配置nginx

#进入nginx.conf ，在 /usr/local/nginx/conf/nginx.conf中

location ~ \.php$ {
root html;
fastcgi_pass 127.0.0.1:9000;
fastcgi_index index.php;
fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
include fastcgi_params;
}

#把这行注释去掉 fastcgi_param SCRIPT_FILENAME \script$fastcgi_script_name;改成fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;

#重启nginx
/usr/local/nginx/sbin/nginx -s reload

#安装完成
ln -s /usr/local/php/sbin/php-fpm  /usr/local/bin/php-fpm
```



### 接下来要设置一下开机启动

```shell
sudo vim /etc/rc.local
```

增加下面两行内容

```shell
/usr/local/bin/nginx
/usr/sbin/php-fpm7.0 或 /usr/local/bin/php-fpm
```

然后就大功告成了