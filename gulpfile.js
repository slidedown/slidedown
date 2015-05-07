var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var minify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var concatCss  = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');

var SRC = 'src/slidedown.js';
var STYLE = 'style/*.css';
var DEST = 'dist/';
if (process.env.SLIDEDOWN_DEST !== undefined) {
  console.log("using env dest: %s", process.env.SLIDEDOWN_DEST);
  DEST = process.env.SLIDEDOWN_DEST;
}

gulp.task('src', function() {
  return gulp.src(SRC)
    .pipe(browserify())
    .pipe(rename('slidedown.build.js'))
    .pipe(gulp.dest(DEST))
    .pipe(minify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(DEST));
});

gulp.task('style', function () {
  return gulp.src(STYLE)
    .pipe(concatCss("slidedown.build.css"))
    .pipe(gulp.dest(DEST))
    .pipe(minifyCss())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(DEST));
});

gulp.task('watch', function() {
  gulp.watch(SRC, ['src']);
  gulp.watch(STYLE, ['style']);
});

gulp.task('default', [ 'src', 'style', 'watch' ]);
