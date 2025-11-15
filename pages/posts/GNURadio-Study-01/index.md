---
title: GNURadio学习记录：配置GNURadio库环境
date: 2025-11-14
updated: 2025-11-15
categories: 业余无线电
tags:

- Amateur Radio  
- GNURadio  
- ASRTU-1
- Lilacsat
- DSLWP

---

前阵子从BG2FWT那要到了哈工大Lilacsat和dslwp的GNURadio3.10的源代码，想要编译为Windows的DLL库，始终未能成功，故转战Ubuntu尝试编译安装

## 安装GNURadio

我选择的是Ubuntu 24.04.3版本，根据GNURadio官网的教程很轻松的就安装成功了GNURadio的主体

## 编译安装库文件

首先可以进入BHC老师的GitHub repo中查看readme文件，链接如下

https://github.com/bg2bhc/gr-dslwp

https://github.com/bg2bhc/gr-lilacsat

### gr-dslwp库的编译安装

其中dslwp库的编译安装较为容易，根据readme文件中可得知编译安装的步骤

首先我们需要解压得到的两个库源码文件

![](./GNU-S1-01.jpg)

解压完成后先进入dslwp的文件夹

![](./GNU-S1-03.jpg)

右键菜单选择打开终端

![](./GNU-S1-04.jpg)

执行如下指令

```
mkdir build
cd build
cmake ../
make
sudo make install
```

其中由于本身包内带有一个build文件夹，可以删除后执行指令

安装完成后可以通过sudo ldconfig检查是否已经安装成功

### gr-lilacsat库的编译安装

在安装完成gr-dslwp库后，我按照相同的步骤进行了gr-lilacsat库的安装，但并没有成功，使用sudo ldconfig提示库文件为空跳过，而且进入库文件夹发现lilacsat库的so文件确实为空文件，此时回顾编译时的日志可以发现缺少了git和doxygen两个依赖，使用sudo apt-get install git doxygen安装后再次编译即可(编译时需要将GNURadio的已经编译导入的库文件删除，不然会出现重新编译后原有的空白文件依旧是空白的，删除后重新编译即可)

此时编译完成后使用sudo ldconfig无错误查出，但是进入GNURadio发现并没有成功导入

如果遇到相同情况，可以使用

```
gnuradio-config-info --prefix
```

检查GNURadio的prefix路径，并通过

```
cmake -DCMAKE_INSTALL_PREFIX=此处填写获取到的prefix路径 ..
```

替代原先的cmake ../指令

执行完毕编译安装结束后即可进入GNURadio看到对应的库文件出现