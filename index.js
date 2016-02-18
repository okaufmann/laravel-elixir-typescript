var gulp = require('gulp');
var elixir = require('laravel-elixir');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var _ = require('underscore');

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
        var tsResult = gulp.src(assetPath + '/**/*.ts')
            .pipe(ts(options))
                .on('error', function(e) {
                    new elixir.Notification().error(e, 'TypeScript Compilation Failed!');
                    this.emit('end');
                });
        return tsResult
            .pipe(concat(outputFileName))
            .pipe(gulp.dest(outputFolder));
            .pipe(new elixir.Notification('TypeScript Compiled!'));
    })
        .watch(assetPath + '/typescript/**');
});
