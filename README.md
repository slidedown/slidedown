# Slidedown

[![David](https://img.shields.io/david/slidedown/slidedown.svg?style=flat-square)](https://david-dm.org/slidedown/slidedown#info=dependencies)
[![David](https://img.shields.io/david/dev/slidedown/slidedown.svg?style=flat-square)](https://david-dm.org/slidedown/slidedown#info=devDependencies)

Write in Markdown. Slidedown will help you render the file into pretty slides.

All magic happens on the client side. A proper loader (`index.html`) is required.  
The good news is, you don't have to prepare your own!!!

This repo contains the source codes for building the core lib, styles and themes.  
Please see [slidedown/slidedown.github.io](https://github.com/slidedown/slidedown.github.io) for usage.

## Development Flow

### 0. Prepare tree

```sh
# create directory for Slidedown repos
~$ mkdir slidedown; cd slidedown
# pull source
~/slidedown$ git clone git@github.com:slidedown/slidedown.git
```

### 1. Development

```sh
# for development, build to slidedown.github.io/lib
~/slidedown/slidedown$ SLIDEDOWN_DEST=../slidedown.github.io/lib gulp
# serve loader with HTTP server
~/slidedown/slidedown/test$ ecstatic  # OR
~/slidedown/slidedown/test$ http-server
# visit http://localhost:9000/ for the test loaders
# you may add other markdowns and loaders
```

### 2. Release

> TODO: write helper script/gulp task for these

```sh
# pull index page (loader)
~/slidedown$ git clone git@github.com:slidedown/slidedown.github.io.git

# for release, build to dist (the default)
~/slidedown/slidedown$ gulp
# increment version number in package.json
~/slidedown/slidedown$ git add -f package.json dist/*

# update slidedown.github.io
~/slidedown/slidedown.github.io$ cp ../slidedown/dist/slidedown.build.min* ./lib/
~/slidedown/slidedown.github.io$ # edit md/new-feature.md, index.md

# commit both repo
# create verion tags for both repo
~/slidedown/slidedown$ git tag $(node -pe 'JSON.parse(process.argv[1]).version' "$(cat package.json)")
~/slidedown/slidedown$ git push --tags
```

## Features

## API

* `Slidedown.fromElements()`
* `Slidedown.fromHTML()`
* `Slidedown.fromMarkdown()`
* `Slidedown.fromXHR()`
* `Slidedown.parseQuery()`
* `Slidedown.setOptions()`

## Attribution

@dtao started [this project](https://github.com/dtao/slidedown) (big thanks BTW).  
@cyrusn and @leesei discovered it, added features to it and created this organization.
