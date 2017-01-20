import Elixir from 'laravel-elixir';
import path from "path";
import filter from 'gulp-filter';

let gulpTypescript, concat, fs;

class TypescriptTask extends Elixir.Task {
    constructor(name, paths, options) {
        super(name, null, paths);

        this.options = options;
    }

    /**
     * Lazy load the task dependencies.
     */
    loadDependencies() {
        gulpTypescript = require('gulp-typescript');
        concat = require('gulp-concat');
        fs = require('fs');
    }

    /**
     * Build the Gulp task.
     */
    gulpTask(){
        const jsFiles = filter(['**/*.js'], {restore: true});
        return (
            gulp
                .src(this.paths.src.path)
                .pipe(this.initSourceMaps())
                .pipe(this.typescript())
                .on('error', this.onError())
                //.pipe($.concat(paths.output.name))
                .pipe(jsFiles)
                .pipe(this.minify())
                .on('error', this.onError())
                .pipe(this.writeSourceMaps())
                .pipe(this.saveAs(gulp))
                .pipe(this.onSuccess())
        )
    }

    typescript() {
            this.recordStep('Transpiling Typescript files');

            if (fs.existsSync('tsconfig.json')) {

                this.recordStep('Using tsconfig.json');
                return gulpTypescript.createProject('tsconfig.json', this.options)(gulpTypescript.reporter.defaultReporter());
            }

            return gulpTypescript(this.options, gulpTypescript.reporter.defaultReporter());
    }

     /**
     * Register file watchers.
     */
    registerWatchers() {
        this.watch(path.join(this.paths.src.baseDir, "**/*.ts"))
            .ignore(this.paths.output.path);
    }
}

export default TypescriptTask;