---
title: 使用MMDVM盒子复活传呼机(上)
date: 2025-07-06
updated: 2025-07-06
categories: 复古
tags:
  - Amateur Radio
  - MMDVM
  - pager
---

## 前言

前阵子搞了一台摩托罗拉的大顾问传呼机，但是由于现在已经是2025年了，已经没有传呼台这种东西了，之前在网上看到过有使用lora模块，STM32+射频模块以及树莓派RPITX的方案，但是苦于手头没有合适的模块所以就没有做这个，然后在网上搜索的时候找到了BH8SEL老师之前发布的贴子
[MMDVM传呼功能（POCSAG）_中国HAM网](https://chinaham.cn/MMDVM/90.html)

## 注册ID

帖子中指出，MMDVM在2018年8月10日发布的3.4.16版本中向Pi-Star添加了POCSAG寻呼支持，也就是说MMDVM盒子就可以担此重任作为一个传呼台工作，前阵子正好把落灰的MMDVM盒子翻出来，遂仔细阅读文章打算复刻一下
帖子中指出先要去[DAPNET Support Desk](https://support.hampager.de/index.php)注册DAPENT发射器和授权码，且需要先注册账号，但是目前最新版本并无注册账号选项，顶部选项如图
![250706-POCSAG-1](250706-POCSAG-1.png)
这里要先选择Open a new ticket，来到以下界面
![250706-POCSAG-2](250706-POCSAG-2.png)
我先根据文章选择了New account with RIC
选择后需要填写一个小介绍，还需要上传你的执照照片(记得把身份信息打码，这个没有关系的)
下面的RIC填写你的DMRID即可
![250706-POCSAG-3](250706-POCSAG-3.png)
提交后等待他会给你预留的邮箱发送一条邮件

![250706-POCSAG-3.5](250706-POCSAG-3.5.png)
这里的账号密码就可以登录[Home | DAPNET Web](https://hampager.de/#/)官网了，但是这个密码并不是MMDVM盒子中的访问密钥，邮件中也提到了此点，这时我们需要回到之前那个注册ID的网站，选择New Transmitter选项
![250706-POCSAG-4](250706-POCSAG-4.png)
这个申请需要你填写你的呼号，经纬度，天线类型，天线高度，天线增益以及发射功率，也是需要写一段描述，按照他给出的提示填写即可，申请后他也会向你的邮箱发送一封邮件，如图
![250706-POCSAG-4.5](250706-POCSAG-4.5.png)
这个Authkey就是你的MMDVM盒子里应该填写的密钥
