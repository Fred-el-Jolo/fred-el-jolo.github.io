---
layout:         post
title:          Node.js installation guide
date:           2017-09-26 10:12:00
image:          nodejs-new-pantone-black.png
image-alt:      nodejs logo
tags:           [nodejs, npm, nvm]
categories:     [guide]
---

NodeJS Installation guide

<!-- more -->

1. TOC
{:toc}

## [NVM](https://github.com/creationix/nvm)
### Installation
```sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
```
Restart the terminal.

### Usagee
```sh
nvm install node              # Install the latest version of node
 
nvm install 4.2.2             # Install v4.2.2 of node
 
nvm use node                  # Use latest version of node
 
nvm exec 4.2 node --version   # Subshell command
```

## [NPM](https://www.npmjs.com/)
### Installation
```sh
which node                        # Get node's path.
cd .nvm/versions/node/v8.5.0/lib/ # Navigate to the above path 
npm install npm                   # Install NPM
```

### Proxy setup
```sh
npm config set proxy http://user:pwd@host:port
npm config set https-proxy http://user:pwd@host:port
```

## [YARN](https://yarnpkg.com/en/)
### Installation
#### Add repository
```sh
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
> OK
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
> deb https://dl.yarnpkg.com/debian/ stable main
```

#### Install with apt-get
```sh
apt-get update
apt-get install yarn
```

### Usage
#### Starting a new project
```sh
yarn init
```

#### Adding a dependency
```sh
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]
```

#### Adding a dependency to a specific category
```sh
yarn add [package] --dev
yarn add [package] --peer 
yarn add [package] --optional
```

#### Upgrading a dependency
```sh
yarn upgrade [package]
yarn upgrade [package]@[version]
yarn upgrade [package]@[tag]
```

#### Removing a dependency
```sh
yarn remove [package]
```

#### Installing all the dependencies of a project
```sh
yarn
```

#### Global action on a package
```sh
yarn global <ACTION> [package]
```
Global packages are installed in `yarn global bin` location.  
That location may be added to the PATH environment variable.

#### Force Yarn to use https on github repositories
```sh
# Fails
yarn add @angular/cli

# Works
yarn add git+https://github.com/angular/angular-cli
```

&nbsp;  
Graphic logo for Node.js software from [nodejs.org/en/about/resources/](https://nodejs.org/en/about/resources/)
