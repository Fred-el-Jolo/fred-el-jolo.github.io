---
layout:         post
title:          Visual Studio Code setup guide
date:           2019-01-29 13:00:00
image:          vscode.png
image-alt:      Visual Studio Code logo
tags:           [visual studio code, vscode, ide]
categories:     [guide]
---

Visual Studio Code setup guide
<!-- more -->

1. TOC
{:toc}

## Tip & tricks
- Interactive playground: Try essentials features (multi-cursor, IntelliSense...). Access it from the welcome page.
- Terminal access : `CTRL + ,`



## Extensions
### Prettier [&#x1f517;](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Material icons

### https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare

## User settings
```json
{
    "javascript.implicitProjectConfig.checkJs": true,
    /// files
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    /// editor
    "editor.fontSize": 18,
    "editor.fontFamily": "Fira Code",
    "editor.fontLigatures": true,
    "editor.formatOnSave": true,
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.renderWhitespace": "all",
    "editor.emptySelectionClipboard": false,
    "editor.wordSeparators": "`~!@#%^&*()=+[{]}\\|;:'\",.<>/?",
    "editor.quickSuggestionsDelay": 0,
    "editor.formatOnPaste": true,
    /// explorer
    "explorer.confirmDelete": false,
    /// Prettier
    //"prettier.eslintIntegration": true,
    /// carbon
    // Automatically adjust the width of the window.
    "carbon.autoAdjustWidth": true,
    // RGBA color to use as the background behind the window.
    "carbon.backgroundColor": "rgba(155,155,155,1)",
    // Render a drop shadow on the window.
    "carbon.dropShadow": false,
    // The drop shadow blur radius. Min: 0, Max: 100
    "carbon.dropShadowBlurRadius": 68,
    // The drop shadow offset. Min: 0, Max: 100
    "carbon.dropShadowOffset": 20,
    // The font family to use.
    "carbon.fontFamily": "Hack",
    // The font size. Min: 10, Max: 18
    "carbon.fontSize": 16,
    // The line height to use. Min: 90, Max: 250
    "carbon.lineHeight": 135,
    // Show line numbers.
    "carbon.lineNumbers": true,
    // The amount of horizontal padding applied to the window.  Min: 0, Max: 100
    "carbon.paddingHorizontal": 0,
    // The amount of vertical padding applied to the window. Min: 0, Max: 200
    "carbon.paddingVertical": 0,
    // Show a watermark.
    "carbon.showWatermark": false,
    // Pick the theme to use.
    "carbon.theme": "solarized light",
    // Change the root url (useful for development).
    "carbon.url": "https://carbon.now.sh",
    // Use your browsers already configured Carbon settings.
    "carbon.useBrowserCache": false,
    // Show window controls.
    "carbon.windowControls": false,
    // The window theme to use. Options: none, sharp, bw 
    "carbon.windowTheme": "none",
}
```
## Key bindings
```json
// Place your key bindings in this file to overwrite the defaults
[
  {
    "key": "ctrl+,",
    "command": "workbench.action.terminal.toggleTerminal"
  },
  {
    "key": "ctrl+,",
    "command": "workbench.action.terminal.focus",
    "when": "!terminalFocus"
  }
]
```


## Sources

[](https://www.smashingmagazine.com/2018/01/visual-studio-code/)
https://dev.to/aspittel/my-visual-studio-code-setup-1emn
https://medium.com/productivity-freak/the-ultimate-vscode-setup-for-js-react-6a4f7bd51a2
https://blog.bitsrc.io/top-10-vs-code-extensions-for-frontend-developers-in-2018-7992282db2ca
https://blog.elmah.io/best-visual-studio-code-extensions/
https://www.shopify.com/partners/blog/best-visual-studio-code-extensions-2017
https://github.com/viatsko/awesome-vscode

Graphic logo for Visual Studio Code software from [en.wikipedia.org/wiki/Visual_Studio_Code#/media/File:Visual_Studio_Code_1.18_icon.svg](https://en.wikipedia.org/wiki/Visual_Studio_Code#/media/File:Visual_Studio_Code_1.18_icon.svg)
