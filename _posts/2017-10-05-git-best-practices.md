---
layout:         post
title:          Git best practices
date:           2017-10-05 15:02:00 +1
image:          Octocat.png
image-alt:      Github logo
tags:           [git, vcs]
categories:     [guide]
---

How to configure and use git

<!-- more -->

1. TOC
{:toc}

## Configuration
```sh
git config --global user.name "Mona Lisa"
git config --global user.email "mlisa@de-vinci.it"
```

## Branch
```sh
git checkout -b <branch_name> <branch_to_derive_from>
```

## Force the use of https instead of ssl (proxy way of life)
```sh
git config --global url."https://github.com/".insteadOf git@github.com:
git config --global url."https://".insteadOf git://
```

## Sources

> [A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/)  
> **Vincent Driessen -** [http://nvie.com/about/](http://nvie.com/about/)

> [git - the simple guide](http://rogerdudler.github.io/git-guide/)  
> **Roger Dudler -** [twitter](http://www.twitter.com/rogerdudler)

&nbsp;  
Octocat logo from [github.com/logos](https://github.com/logos)
