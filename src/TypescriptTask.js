import Elixir from 'laravel-elixir';
import path from "path";
import filter from 'gulp-filter';
import {assignIn} from 'lodash';

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
                .pipe(this.saveAs(gulp)) // this is just to record the step and has no effect since we use tsc to compile and save files.
                .pipe(this.onSuccess())
        )
    }

    typescript() {
            this.recordStep('Transpiling Typescript files');

            if (fs.existsSync('tsconfig.json')) {

                this.recordStep('Using tsconfig.json');

                let tsOptions = this.options;
                if (this.paths.output) {
                    tsOptions = assignIn({outFile: this.paths.output.path}, this.options);
                }

                return gulpTypescript.createProject('tsconfig.json', tsOptions)(gulpTypescript.reporter.defaultReporter());
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