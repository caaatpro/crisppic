var fileinclude = require('gulp-file-include'),
  gulp = require('gulp'),
  validator = require("gulp-html"),
  w3cjs = require('gulp-w3cjs'),
  sass = require('gulp-sass'),
  del = require('del'),
  runSequence = require('run-sequence'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  cleanCSS = require('gulp-clean-css'),
  rename = require('gulp-rename');


gulp.task('html', function() {
  return gulp.src(['source/**/*.html', '!source/include/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(w3cjs())
		.pipe(w3cjs.reporter())
    .pipe(gulp.dest('public'));
});

gulp.task('sass', function () {
  return gulp.src('source/styles/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', '> 5%'))
    .pipe(gulp.dest('public/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.minifiedSize + ' / ' + details.stats.originalSize) ;
        }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('images', function() {
  return gulp.src('source/images/*.*')
    // .pipe(imagemin())
    .pipe(gulp.dest('public/images'))
});

gulp.task('fonts', function() {
  return gulp.src('source/fonts/**/*.*')
    .pipe(gulp.dest('public/fonts'))
});
gulp.task('js', function() {
  return gulp.src('source/js/**/*.*')
    .pipe(gulp.dest('public/js'))
});

gulp.task('clean', function (callback) {
  del.sync(['dist'], callback);
});

gulp.task('build', function(callback) {
  gulp.run('html');
  gulp.run('sass');
  gulp.run('images');
  gulp.run('fonts');
  gulp.run('js');
  // runSequence(['html', 'sass', 'images', 'fonts', 'js'],
  //   callback
  // )
});
