---
layout:         post
title:          Raspberry pi cluster with Kubernetes
date:           2018-01-06 22:41:00 +1
image:          kubernetes.png
image-alt:      Kubernetes logo
tags:           [raspberry pi, cluster, kubernetes, docker, hypriot os]
categories:     [link]
---

Raspberry pi cluster setup with Hypriot OS & Kubernetes 

<!-- more -->

1. TOC
{:toc}

## Flash SD cards

### Flash tool
#### Installation
[Github repo](https://github.com/hypriot/flash)

```sh
curl -O https://raw.githubusercontent.com/hypriot/flash/master/$(uname -s)/flash
chmod +x flash
sudo mv flash /usr/local/bin/flash
```

The tool needs the (optional) following dependencies:
- curl: if you want to flash directly with an HTTP URL
- aws: if you want to flash directly from an AWS S3 bucket
- pv: to see a progress bar while flashing with the dd command
- unzip: to extract zip files.
- hdparm: to run the program

```sh
sudo pacman -S curl pv unzip hdparm
```

Download the cloud-init following configuration files :

```sh
wget https://github.com/hypriot/flash/raw/master/sample/no-uart-config.txt
wget https://github.com/hypriot/flash/raw/master/sample/wifi-user-data.yml
```

Copy them into a master folder, edit them if needed and then launch the flash command to flash the SD card:
```sh
flash --userdata master/wlan-user-data.yaml --bootconf master/no-uart-config.txt https://github.com/hypriot/image-builder-rpi/releases/download/v1.7.1/hypriotos-rpi-v1.7.1.img.zip
```

## Sources
> [Setup Kubernetes on a Raspberry Pi Cluster easily the official way!](https://blog.hypriot.com/post/setup-kubernetes-raspberry-pi-cluster/)  

&nbsp;  
Graphic logo for Node.js software from [github.com/kubernetes/kubernetes/tree/master/logo](https://github.com/kubernetes/kubernetes/tree/master/logo)
