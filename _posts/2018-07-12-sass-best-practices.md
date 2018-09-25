---
layout:         post
title:          Sass best practices
date:           2018-07-12 20:00:00 +1
image:          sass.png
image-alt:      Sass logo
tags: [sass, css, scss, design, a1, a2, a3, a4, a5, a6, a7, a8, a9, aa10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, aaa22, a23, a24, a25, a26, a27, a28, a29, aa30, aa31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42]
categories: [link1, link2, link3, link4]
---

Reference & summary of Sass best practices

<!-- more -->

1. TOC
{:toc}

## Syntax & formatting
Follow the [Sass Guidelines - Syntax formatting](https://sass-guidelin.es/#syntax--formatting) chapter.

```js
var a = [1,2,3];
var b = [1,2,3];
var c = "1,2,3";

a == c;     // true, coercion applied on the arrayaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbb
b == c;     // true, coercion applied on the array
a == b;     // false
```

A few reminders :
- Force UTF-8 encoding with `@charset 'utf-8';` in main file
- 0 value should never have a unit
- To add a unit to a number, you have to multiply this number by 1 unit.

```scss
$value: 42;

// Yep
$length: $value * 1px;

// Nope
$length: $value + px;
```

- To remove the unit of a value, you have to divide it by one unit of its kind.

```scss
$length: 42px;

// Yep
$value: $length / 1px;

// Nope
$value: str-slice($length + unquote(''), 1, 2);
```

- Prefer HSL, RGB over Hexadecimal notations (in that order)

```scss
// Yep
.foo {
  color: hsl(0, 100%, 50%);
}

// Also yep
.foo {
  color: rgb(255, 0, 0);
}

// Meh
.foo {
  color: #f00;
}

// Nope
.foo {
  color: #FF0000;
}

// Nope
.foo {
  color: red;
}
```

## Architecture
### Use the 7-1 pattern (7 folders, 1 file)
```
├── main.scss
├── abstracts               // Sass tools and helpers used across
│   └── _module.scss        // the project
│   └── _variables.scss
│   └── _functions.scss
│   └── _mixins.scss
│   └── _placeholders.scss
├── base                    // Boilerplate code for the project
│   └── _module.scss
│   └── _normalize.scss
│   └── _typography.scss
├── components              // For smaller components (layout is
│   └── _module.scss        // macro)
│   └── _buttons.scss
│   └── _carousel.scss
│   └── _cover.scss
│   └── _dropdown.scss
├── layout                  // Everything that takes part in
│   └── _module.scss        // laying out the site or application
│   └── _navigation.scss
│   └── _grid.scss
│   └── _header.scss
│   └── _footer.scss
│   └── _sidebar.scss
│   └── _forms.scss
├── pages                   // Page-specific styles
│   └── _module.scss
│   └── _home.scss
│   └── _contact.scss
├── themes                  // Themes
│   └── _module.scss
│   └── _theme.scss
│   └── _admin.scss
└── vendors                 // External libraries and frameworks
    ├── _module.scss
    └── _bootstrap.scss
    └── _jquery-ui.scss
    └── normalize-scss
        ├── _normalize.scss
        ├── _variables.scss
        └── _vertical-rhythm.scss
```

## Mixins vs Placeholders
- Same properties that won't change : placeholder + @extend
- Properties with different values : @mixin

## Media queries
- Use [include-media](http://include-media.com/)

## Tools & frameworks
- Autoprefixer
- (https://css-tricks.com/snippets/css/complete-guide-grid/)

## Sources

> [Sass Guidelines](https://sass-guidelin.es/)  
> **Hugo Giraudel -** [hugogiraudel.com](http://hugogiraudel.com/)

> [Aesthetic Sass 1: Architecture and Style Organization](https://scotch.io/tutorials/aesthetic-sass-1-architecture-and-style-organization)  
> [Aesthetic Sass 2: Colors and Palettes](https://scotch.io/tutorials/aesthetic-sass-2-colors)  
> [Aesthetic Sass 3: Typography and Vertical Rhythm](https://scotch.io/tutorials/aesthetic-sass-3-typography-and-vertical-rhythm)  
> **David Khourshid -** [twitter.com/DavidKPiano](https://twitter.com/DavidKPiano)
