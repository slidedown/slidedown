# Developer test page

## See Markdown [source](http://github.com/slidedown/slidedown)

***
# Table of Content

<!-- Add table of Content -->
<div id='toc'></div>

***
# Headings 1
## Headings 2
### Headings 3
#### Headings 4
##### Headings 5
###### Headings 6

```md
# Headings 1
## Headings 2
### Headings 3
#### Headings 4
##### Headings 5
###### Headings 6
```

    heading 1 - 2 will be aligned to center and parsed to Table of Content
    heading 3 - 6 will be aligned to left

***
# Styling text

- *Italic*
- **Bold**
- ***Bold and Italic***
- ~~Delete~~

### markdown syntax
``` md
- *Italic*
- **Bold**
- ***Bold and Italic***
- ~~Delete~~
```

***
# Blockquotes

Use `>` sign for Blockquote
> Empty your mind, be *formless*. *Shapeless*, like **water**. If you put water into a cup, it becomes the cup. You put water into a bottle and it becomes the bottle. You put it in a teapot, it becomes the teapot. Now, water can *flow* or it can *crash*. ***Be water, my friend***.”

### markdown syntax
``` md
> Empty your mind, be *formless*. *Shapeless*, like **water**. If you put water into a cup, it becomes the cup. You put water into a bottle and it becomes the bottle. You put it in a teapot, it becomes the teapot. Now, water can *flow* or it can *crash*. ***Be water, my friend***.”
```

***
# Syntax Highlight

There are **multiple syntax highlighting themes** to choose from. Here's one of them:


<pre class='hljs'>
``` javascript
// All the code you will ever need
var hw = "Hello World!"
alert(hw);
```
</pre>

<div class="caption">What you type in md</div>

``` javascript
// All the code you will ever need
var hw = "Hello World!"
alert(hw);
```
<div class="caption">Result</div>

***
# List

- You just **type naturally**, and the result looks good.
- You **don't have to worry** about clicking formatting buttons.
  - Or fiddling with indentation. (Two spaces is all you need.)

``` md
- You just **type naturally**, and the result looks good.
- You **don't have to worry** about clicking formatting buttons.
  - Or fiddling with indentation. (Two spaces is all you need.)
```

***
# Image
You can also make link to your image

``` md
<!-- Image Only -->
![caption](link/to/image.jpg)

<!-- Image with Link -->
[![caption](link/to/image.jpg)](link/to/page.html)

```

![Text here will work like caption of image][image1]


***
# Table

|Name      | Lunch order        | Owes       |
|:-------  | :----------------: | ---------: |
|Joan      | saag paneer        | $11        |
|Sally     | vindaloo           | $14        |
|Erin      | lamb madras        | $5         |

### You can type a table like this:
``` md
<!-- space can be omitted, they are here to make the markdown more readable -->

|Name      | Lunch order        | Owes       |
|:-------  | :----------------: | ---------: |
|Joan      | saag paneer        | $11        |
|Sally     | vindaloo           | $14        |
|Erin      | lamb madras        | $5         |

```

***

# Column 1

1. apple
2. orange
3. pear


# Column 2
- foo
- bar
- baz


***
# GFM markdown [line break][link-break]

Lorem *ipsum* dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim **veniam**, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in ***reprehenderit*** in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint ~~occaecat~~ cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.

***
# End

[basic]: https://help.github.com/articles/markdown-basics/
[gfm]: https://help.github.com/articles/github-flavored-markdown/
[image1]: http://2.bp.blogspot.com/-dxJbW0CG8Zs/TmkoMA5-cPI/AAAAAAAAAqw/fQpsz9GpFdo/s1600/voyage-dans-la-lune-1902-02-g.jpg
[link-break]: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#lines
