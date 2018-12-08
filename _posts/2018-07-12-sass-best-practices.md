---
layout:         post
title:          Sass best practices
date:           2018-07-12 20:00:00 +1
image:          sass.png
image-alt:      Sass logo
tags:           [sass, css, scss, design]
categories:     [design, ui, ux]
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
- `0` value should never have a unit
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
### Use the bem methodology
- Use [Block Element Modifier methodology](http://getbem.com/)
- and [10 common problems and how to avoid them](https://www.smashingmagazine.com/2016/06/battling-bem-extended-edition-common-problems-and-how-to-avoid-them/)

## Mixins vs Placeholders
- Same properties that won't change : `%placeholder + @extend`
- Properties with different values : `@mixin`

## Media queries
- Use [include-media](http://include-media.com/)

## Tools & frameworks
- Autoprefixer
- [Css Grid guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

## Sources

> [Block Element Modifier methodology](http://getbem.com/)

> [Sass Guidelines](https://sass-guidelin.es/)  
> **Hugo Giraudel -** [hugogiraudel.com](http://hugogiraudel.com/)

> [Aesthetic Sass 1: Architecture and Style Organization](https://scotch.io/tutorials/aesthetic-sass-1-architecture-and-style-organization)  
> [Aesthetic Sass 2: Colors and Palettes](https://scotch.io/tutorials/aesthetic-sass-2-colors)  
> [Aesthetic Sass 3: Typography and Vertical Rhythm](https://scotch.io/tutorials/aesthetic-sass-3-typography-and-vertical-rhythm)  
> **David Khourshid -** [twitter.com/DavidKPiano](https://twitter.com/DavidKPiano)
