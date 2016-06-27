/**
 * Created by zhaoyan on 16/6/13.
 */

'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var del = require('del');
var size = require('gulp-size');
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');
var minifyHtml = require('gulp-htmlmin');
var replace = require('gulp-replace');
var util = require('gulp-util');
var browserSync = require('browser-sync').create();

gulp.task('sass', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('imagemin', function() {
  return gulp.src('./img/*')
    .pipe(imagemin([imagemin.jpegtran(), imageminPngquant()]))
    .pipe(gulp.dest('./tmp'));
});

gulp.task('uglify', ['sass'], function() {
  return gulp.src('./template/*.html')
    .pipe(useref())
    .pipe(replace(/<title>(.*)<\/title>/i, '<title>@@title</title>'))
    .pipe(replace(/"bundle\.css"/ig, '"@@bundleCss"'))
    .pipe(replace(/"viewport\.js"/ig, '"@@viewportJs"'))
    .pipe(replace(/"bundle\.js"/ig, '"@@bundleJs"'))
    .pipe(replace(/"\.\.\/img\/topic\.png"/ig, '"@@topicImg"'))
    .pipe(replace(/"\.\.\/img\/question\.png"/ig, '"@@question"'))
    .pipe(replace(/"\.\.\/img\/answer\.png"/ig, '"@@answer"'))
    .pipe(replace(/"\.\.\/img\/poster\.bmp"/ig, '"@@poster"'))
    .pipe(replace('../img/', ''))
    .pipe(gulpIf('*.js', uglify().on('error', util.log)))
    .pipe(gulpIf('*.css', replace('../img/', '')))
    .pipe(gulpIf('*.css', minifyCss({keepSpecialComments: 0})))
    //.pipe(gulpIf('*.html', minifyHtml({collapseWhitespace: true, removeComments: true, minifyJS: true, minifyCSS: true})))
    .pipe(gulp.dest('./tmp'));
});

gulp.task('clean', function() {
  return del.sync(['./tmp']);
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch('./scss/**/*.scss', ['sass']);
  gulp.watch([
    './template/**/*.html',
    './css/**/*',
    './js/**/*.js',
    './img/**/*'
  ]).on('change', browserSync.reload);
});

gulp.task('build', ['imagemin', 'uglify'], function() {
  return gulp.src('./tmp/**/*')
    .pipe(size({title: 'file:', showFiles: true}));
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
