var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var minify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var concatCss  = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');

var JS = 'js/slidedown.js';
var CSS = 'css/*.css';
var DEST = 'dist/';
if (process.env.SLIDEDOWN_DEST !== undefined) {
  console.log("using env dest: %s", process.env.SLIDEDOWN_DEST);
  DEST = process.env.SLIDEDOWN_DEST;
}

gulp.task('js', function() {
  return gulp.src(JS)
    .pipe(browserify())
    .pipe(rename('slidedown.build.js'))
    .pipe(gulp.dest(DEST))
    .pipe(minify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(DEST));
});

gulp.task('css', function () {
  return gulp.src(CSS)
    .pipe(concatCss("slidedown.build.css"))
    .pipe(gulp.dest(DEST))
    .pipe(minifyCss())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(DEST));
});

gulp.task('watch', function() {
  gulp.watch(JS, ['js']);
  gulp.watch(CSS, ['css']);
});

gulp.task('default', [ 'js', 'css', 'watch' ]);
