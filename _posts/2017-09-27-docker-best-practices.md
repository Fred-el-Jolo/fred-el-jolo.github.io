---
layout:         post
title:          Docker best practices
date:           2017-09-09 23:14:00 +1
image:          docker.png
image-alt:      docker logo
tags:           [docker]
categories:     [link]
---

Reference & summary of docker best practices

<!-- more -->

1. TOC
{:toc}

## Docker
### Installation
#### Debian
##### Update the apt-get package index
```sh
sudo apt-get update
```

##### Install packages to use a repository over HTTPS
```sh
sudo apt-get install \
     apt-transport-https \
     ca-certificates \
     curl \
     gnupg2 \
     software-properties-common
```

##### Add Docker’s official GPG key
```sh
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -
```

##### Verify the fingerprint (last 8 characters)
```sh
sudo apt-key fingerprint 0EBFCD88
```

##### Setup the stable docker repository
```sh
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
   $(lsb_release -cs) \
   stable"
```

##### Update the apt-get package index
```sh
sudo apt-get update
```

##### Install docker
```sh
sudo apt-get install docker-ce                  # Latest version
apt-cache madison docker-ce                     # List available versions
                                                # (use 2nd column as VERSION_STRING)
sudo apt-get install docker-ce=<VERSION_STRING> # Install specific version.
```
The Docker daemon starts automatically.

##### Setup proxy
###### Edit the file `/etc/default/docker` and modify the proxy settings
###### Restart the docker service
```sh
service docker restart
```

##### Run the hello-world image
```sh
sudo docker run hello-world
```

##### If not working
```sh
/etc/systemd/system/docker.service.d/http-proxy.conf
/etc/systemd/system/docker.service.d/https-proxy.conf
sudo systemctl daemon-reload       # Flush changes
sudo systemctl restart docker      # Restart docker service
```

### Usage
#### Build image with a custom name
```sh
docker build -t customName .
```


## Docker compose
### Installation
#### Debian
##### Download latest package
```sh
sudo curl -L https://github.com/docker/compose/releases/download/1.16.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
```

##### Apply executable permissions
```sh
sudo chmod +x /usr/local/bin/docker-compose
```

##### Test the installation
```sh
$ docker-compose --version
docker-compose version 1.16.1, build 1719ceb
```

### Usage
todo

## Sources
> [Get Docker CE for Debian](https://docs.docker.com/engine/installation/linux/docker-ce/debian/#install-using-the-repository)

> [RHD Blog - 10 things to avoid in docker containers](https://developers.redhat.com/blog/2016/02/24/10-things-to-avoid-in-docker-containers/)  
> **@rafabene -** [twitter](https://www.twitter.com/rafabene)

