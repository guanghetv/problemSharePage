/**
 * Created by zhaoyan on 16/6/13.
 */

'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var del = require('del');
var size = require('gulp-size');
var browserSync = require('browser-sync').create();

gulp.task('sass', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('clean', function() {
  return del([
    'tmp'
  ]);
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch('./scss/**/*.scss', ['sass']);
  gulp.watch([
    'template/**/*.html',
    'css/**/*',
    'js/**/*.js'
  ]).on('change', browserSync.reload);
});

gulp.task('build', function() {
  return gulp.src('template/*.html')
    .pipe(useref())
    .pipe(size({title: 'build', showFiles: true}))
    .pipe(gulp.dest('tmp'));
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
