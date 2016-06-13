/**
 * Created by zhaoyan on 16/6/13.
 */

'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('sass', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
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

gulp.task('default', function() {
  console.log('default task.');
});
