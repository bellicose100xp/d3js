'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
var connect = require('gulp-connect'); //runs a local web server
var source = require('vinyl-source-stream'); //Use conventional text stream with gulp ???
var lint = require('gulp-eslint'); //performs code check
const debug = require('gulp-debug');


var config = {
    port: 9000,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './index.html',
        dist: './dist',
        js: './src/**/*.js',
        images: '',
        css: []
    }
};

gulp.task('connect', function () {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('js', () => {
    return gulp.src(config.paths.js)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('all.js'))
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload())
});

gulp.task('html', function(){
    gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload())

});

gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
});

gulp.task('default', ['html', 'js', 'connect', 'watch']);

