var fileinclude = require('gulp-file-include'),
  gulp = require('gulp'),
  validator = require("gulp-html"),
  w3cjs = require('gulp-w3cjs'),
  sass = require('gulp-sass'),
  del = require('del'),
  runSequence = require('run-sequence');


gulp.task('html', function() {
  return gulp.src(['public/**/*.html', '!public/include/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(w3cjs())
		.pipe(w3cjs.reporter())
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
  return gulp.src('public/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('images', function() {
  return gulp.src('public/images/*.*')
    // .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('public/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'))
});
gulp.task('js', function() {
  return gulp.src('public/js/**/*.*')
    .pipe(gulp.dest('dist/js'))
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
