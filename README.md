laravel-elixir-typescript
========================

**(forked from laravel-elixir-typescript by [MikeyAlder](https://github.com/MikeyAlder/laravel-elixir-typescript))**

[![npm version](https://badge.fury.io/js/laravel-elixir-typescript.svg)](https://badge.fury.io/js/laravel-elixir-typescript)

## Renaming Notice
Since the original version of @MikeyAlder is no longer maintained this Plugin uses now it's name `laravel-elixir-typescript`.
**Please do no longer use `elixir-typescript`**

## Prerequirement
You have to install [Laravel's Elixir](http://laravel.com/docs/master/elixir)(Version 6.0 or higher) and its dependencies first.

Consult Changelog.md

## Installation
Install through Node.js

```js
yarn add laravel-elixir-typescript
```

## Usage
A simple [gulp-typescript](https://github.com/ivogabe/gulp-typescript) wrapper ingredient for Laravel Elixir.

Add it to your Elixir-enhanced Gulpfile, like so:

```js
var elixir = require('laravel-elixir');

// import the dependency
require('laravel-elixir-typescript');

elixir(function(mix) {
  mix.typescript('app.ts');
});
```

This will compile `app.ts` in `resources/assets/typescript/` and concat the compiled content into `public/js/app.js`.

If you'd like to output to a different directory than the default `public/js`, then you may override this by providing an output path as a second parameter.

```js
mix.typescript('app.ts', 'public/js/foo/bar.js');
```

Further you could insert multiple files like

```js
elixir(function(mix) {
  mix.typescript(['module1.ts', 'module2.ts']);
});
```

### tsconfig.json
Just put `tsconfig.json` into the root folder (where your gulpfile.js lives) and the plugin will automatically use it.

## Parameters

Bellow is the list of the available parameters:

- **src**: Filename for output
- **output**(optional): Where to place the output file. Default: `public/js/`
- **baseDir,**(optional): Where to search your ts files. Default: `null`
- **options** (optional): Options to forward to the `gulp-typescript` used for compiling. All options under https://github.com/ivogabe/gulp-typescript#options
