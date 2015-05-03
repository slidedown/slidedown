# slidedown

Write in Markdown. slidedown will help you render the file into pretty slides.  
All magic happens on the client side. A proper loader (`index.html`) is required.  
The good news is, you don't have to prepare your own!!!

This repo contains the source codes for building the core lib, styles and themes.  
Please see [slidedown/slidedown.github.io](https://github.com/slidedown/slidedown.github.io) for usage.

## Development Flow

### 0. Prepare tree

```sh
# create directory for slidedown repos
~$ mkdir slidedown; cd slidedown
# pull source
~/slidedown$ git clone git@github.com:slidedown/slidedown.git
# pull index page (loader)
~/slidedown$ git clone git@github.com:slidedown/slidedown.github.io.git
```

### 1. Development

```sh
# for development, build to slidedown.github.io/lib
~/slidedown/slidedown$ SLIDEDOWN_DEST=../slidedown.github.io/lib gulp
# serve slidedown.github.io with HTTP server
~/slidedown/slidedown.github.io$ ecstatic
```

### 2. Release

```sh
# for release, build to dist (the default)
~/slidedown/slidedown$ gulp
# then update slidedown.github.io
~/slidedown/slidedown$ cp dist/slidedown.build.{js,css} ../slidedown.github.io/lib/
# commit both repo
# create verion tags for both repo
```

## Features



## Attribution

@dtao started [this project](https://github.com/dtao/slidedown) (big thanks BTW).  
@cyrusn and @leesei discovered it, added features to it and created this organiztion.
