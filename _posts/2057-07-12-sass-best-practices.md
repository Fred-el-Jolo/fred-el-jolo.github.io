---
layout:         post
title:          Sass best practices
date:           2018-07-12 20:00:00 +1
image:          https://via.placeholder.com/140x140
image-alt:      placeholder
tags: [sass, css, scss, design]
categories: [link]
---

Reference & summary of Sass best practices

<!-- more -->

## Syntax & formatting
Follow the [Sass Guidelines - Syntax formatting](https://sass-guidelin.es/#syntax--formatting) chapter.
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

> ## [Hugo Giraudel](http://hugogiraudel.com/)
> [Sass Guidelines](https://sass-guidelin.es/)

> ## [David Khourshid](https://twitter.com/DavidKPiano)
> [Aesthetic Sass 1: Architecture and Style Organization](https://scotch.io/tutorials/aesthetic-sass-1-architecture-and-style-organization)
> [Aesthetic Sass 2: Colors and Palettes](https://scotch.io/tutorials/aesthetic-sass-2-colors)
> [Aesthetic Sass 3: Typography and Vertical Rhythm](https://scotch.io/tutorials/aesthetic-sass-3-typography-and-vertical-rhythm)
> (http://thesassway.com/beginner)
sassway.com/beginner)
