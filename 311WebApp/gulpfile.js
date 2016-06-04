'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');

gulp.task('vendor-js', function() {
  return gulp.src('./vendor/**/*.js')
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('../public/src'));
});

gulp.task('bundle-js', function() {
  return gulp.src('./scripts/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('../public/src'));
});

gulp.task('vendor-css', function() {
  return gulp.src('./vendor/**/*.css')
    .pipe(concatCss('vendor.css'))
    .pipe(gulp.dest('../public/css'));
});

gulp.task('sass', function () {
  return gulp.src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('../public/css'));
});

gulp.task('file:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('./vendor/**/*.css', ['vendor-css']);
  gulp.watch('./scripts/**/*.js', ['bundle-js']);
});

gulp.task('default', ['sass',
                      'file:watch',
                      'vendor-css',
                      'vendor-js',
                      'bundle-js'
                     ], function() {});
