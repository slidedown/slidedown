var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var minify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var concatCss  = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');

var JS = "js/slidedown.js";
var CSS = 'css/*.css';

gulp.task('js', function() {
  return gulp.src(JS)
    .pipe(browserify())
    .pipe(minify())
    .pipe(rename('slidedown.build.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
  return gulp.src(CSS)
    .pipe(concatCss("slidedown.build.css"))
    .pipe(minifyCss())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(JS, ['js']);
  gulp.watch(CSS, ['css']);
});

gulp.task('default', [ 'js', 'css', 'watch' ]);
