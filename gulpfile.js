// BROWSERIFY
var browserify = require('browserify');
var babelify = require('babelify');
// GULP
var gulp = require('gulp');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss  = require('gulp-minify-css');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var util = require('gulp-util');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var fs = require('fs');
var pug = require('gulp-pug');
var data = require('gulp-data');
var sync = require('gulp-npm-script-sync');
var webserver = require('gulp-webserver');

var dist = './dist/'

// Bundle Sass
gulp.task('sass-dev', function() {
  gulp.src('./src/sass/style.sass')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions','last 3 iOS versions','> 1%'],
      cascade: true
    }))
    .pipe(gulp.dest('./src/_temp'))
    .pipe(gulp.dest(dist + 'css/'));
});

gulp.task('sass-prod', function() {
  gulp.src('./src/sass/style.sass')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions','last 3 iOS versions','> 1%'],
      cascade: true
    }))
    .pipe(gulp.dest('./src/_temp'))
    .pipe(minifycss())
    .pipe(gulp.dest(dist + 'css/'));
});

// Bundle JS with Browserify - DEV
gulp.task('js', function() {
  browserify({
    entries: './src/js/app.js',
    debug: true
  })
  .bundle()
  .on('error', err => {
    util.log("Browserify Error", util.colors.red(err.message))
  })
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(gulp.dest(dist + 'js/'));
});

// Bundle JS with Browserify - PROD
gulp.task('js-prod', function() {
  browserify({
    entries: './src/js/app.js',
    debug: false
  })
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest(dist + 'js/'));
});

// PUG
gulp.task('pug', function buildHTML() {
  return gulp.src('./src/pug/*.pug')
  .pipe(data(function(file) {
    return JSON.parse(
      fs.readFileSync('./src/_data/_data.json')
    );
  }))
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest(dist));
});

// Serve
gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({
      fallback: 'index.html',
      livereload: true,
      open: true
    }));
});

// Watch All
gulp.task('watch', function() {
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch(['./src/sass/**/*.sass'], ['sass-dev']);
  gulp.watch(['./src/pug/**/*.pug'], ['pug']);
  gulp.watch(['./src/_data/_data.json'], ['pug']);
});

// DEFAULT TASK
gulp.task('default', function(cb) {
  runSequence('pug','sass-dev','js','webserver','watch');
})

gulp.task('dev', function(cb) {
  runSequence('pug','sass-dev','js','webserver','watch');
})

gulp.task('build', function(cb) {
  runSequence('pug','sass-prod','js-prod');
})

// NPM SYNC
sync(gulp, {
  path: './package.json',
  excluded: ['default', 'watch', 'js-prod', 'js', 'sass-dev', 'pug', 'sass-prod', 'webserver']
});
