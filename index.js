var gulp = require('gulp');
var elixir = require('laravel-elixir');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var _ = require('underscore');
var sourcemaps = require('gulp-sourcemaps');
var lazypipe = require('lazypipe');

// Laravel Elixir Reporter
var _laravelReporter = require('./reporter');

var Task = elixir.Task;

elixir.extend('typescript', function (outputFileName, outputFolder, search, options) {

    var pluginName = 'typescript';
    var assetPath = './' + elixir.config.assetsPath;

    outputFolder = outputFolder || './public/js/';
    search = search || '/typescript/**/*.ts';

    options = _.extend({
        sortOutput: true
    }, options);

    new Task(pluginName, function () {
        var compile = lazypipe();
        
        if (options.sourceMap) {
            compile = compile.pipe(sourcemaps.init);
        }

        compile = compile.pipe(ts, options, undefined, _laravelReporter.ElixirMessage())

        if (options.sourceMap) {
            compile = compile.pipe(sourcemaps.write, './');
        }

        if (outputFileName) {
            compile = compile.pipe(concat, outputFileName);
        }

        return gulp.src(assetPath + search)
            .pipe(compile())
            .pipe(gulp.dest(outputFolder));
    })
    .watch(assetPath + '/typescript/**');
});
