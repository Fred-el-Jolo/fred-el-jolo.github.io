---
layout:         post
title:          Create users & configure SSH on Debian
date:           2017-08-12 15:16:00 +1
image:          ssh-icon-15047.png
image-alt:      terminal and ssh
tags:           [unix, ssh, user]
categories:     [guide]
---

Quick guide to create new users on Debian and to create and configure SSH keys for remote access.

<!-- more -->

1. TOC
{:toc}

## Create new user

```sh
adduser <USER_NAME>
```

Fill in the user data.
```sh
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
Changing the user information for <USER_NAME>
Enter the new value, or press ENTER for the default
        Full Name []:
        Room Number []:
        Work Phone []:
        Home Phone []:
        Other []:
Is the information correct? [Y/n]
```

## Add user to group

```sh
adduser <USER_NAME> <GROUP_NAME>
```

-----------------------------------

## Create SSH key on Windows

- Download the [puttygen.exe](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) tool.
- Click on "Generate"
- Save public & private keys

## Configure unix account with the private SSH key
- Log on to the server
- Create .ssh folder and the file .ssh/authorized_keys in the corresponding user home
- Paste the key from the Puttygen field "Public key for pasting into OpenSSH authorized_keys file"
- The key must begin by `ssh-rsa`
- You can now log on with SSH to the remote server.
