const concat = require('gulp-concat');
const ts = require('gulp-typescript');
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');

const Elixir = require('laravel-elixir');

const _ = require('underscore');

const $ = Elixir.Plugins;
const config = Elixir.config;

let assetsPath = config.assetsPath;
let publicPath = config.publicPath;
let jsOutputFolder = config.js.outputFolder;

// overwrite elixir config values
var tsFolder = path.join(assetsPath, "typescript"); // would be config.get('assets.js.typescript.folder');
var tsOutput = path.join(publicPath, jsOutputFolder);

Elixir.extend('typescript', function (src, baseDir, output, options) {
    var paths = prepGulpPaths(src, baseDir, output);

    new Elixir.Task('typescript', function () {
        // this.log(paths.src, paths.output);

        // register watchers
        this.watch(path.join(paths.src.baseDir, "**/*.ts"))
            .ignore(paths.output.path)

        this.recordStep('Transpiling Typescript files');

        // check if there is an tsconfig.json file --> initialize ts project
        var tsProject = null;
        if (fs.existsSync('tsconfig.json')) {
            this.recordStep('Using tsconfig.json');
            tsProject = ts.createProject('tsconfig.json', options);
        } else {
            // useful default options
            options = _.extend({
                sortOutput: true
            }, options);
        }

        return (
            gulp
                .src(paths.src.path)
                .pipe($.if(config.sourcemaps, $.sourcemaps.init()))
                .pipe(ts(tsProject == null ? options : tsProject)
                    .on('error', this.onError()))
                .pipe($.concat(paths.output.name))
                .pipe($.if(config.production, $.uglify()))
                .pipe($.if(config.sourcemaps, $.sourcemaps.write('.')))
                .pipe(this.saveAs(gulp))
                .pipe(this.onSuccess())
        );
    }, paths);
});

/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|Array} src
 * @param  {string|null}  output
 * @return {GulpPaths}
 */
var prepGulpPaths = function (src, baseDir, output) {
    return new Elixir.GulpPaths()
        .src(src, baseDir || tsFolder)
        .output(output || Elixir.config.get('public.js.outputFolder'), 'all.js');
};