var gulp = require('gulp');
var elixir = require('laravel-elixir');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var _ = require('underscore');

// Laravel Elixir Reporter
var _laravelReporter = require('./reporter');

var Task = elixir.Task;

elixir.extend('typescript', function (output, dest, search, options) {

    var pluginName = 'typescript';
    var assetPath = './' + elixir.config.assetsPath;

    dest = dest || './public/js/app.js';
    search = search || '/**/*.ts';

    options = _.extend({
        sortOutput: true
    }, options);

    new Task(pluginName, function () {
        var tsResult = gulp.src(assetPath + search)
            .pipe(ts(options, undefined, _laravelReporter.ElixirMessage()));
        return tsResult
            .pipe(concat(output))
            .pipe(gulp.dest(dest));
    })
        .watch(assetPath + '/typescript/**');
});