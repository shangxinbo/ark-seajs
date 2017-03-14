
'use strict'
const gulp = require('gulp')
const less = require('gulp-less')
const cssmin = require('gulp-clean-css')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const replace = require('gulp-replace')
const rename = require("gulp-rename")
const uglify = require('gulp-uglify')
const swig = require('gulp-swig')
const config = require('./config.json')

let destPhpDir = config ? config.php_code_path : 'D:/php_ark/public/static/'

gulp.task('php', function () {
    gulp.src('public/img/**/*')
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(gulp.dest(destPhpDir + 'img/'));
    gulp.src('public/css/**/*')
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(gulp.dest(destPhpDir + 'css/'));
    gulp.src('public/js/modules/*')
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(replace('"/php', '"'))
        .pipe(replace("'/php", "'"))
        .pipe(gulp.dest(destPhpDir + 'js/modules'));
    gulp.src('public/js/page/*')
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(replace('"/php', '"'))
        .pipe(replace("'/php", "'"))
        .pipe(gulp.dest(destPhpDir + 'js/page'));
    gulp.src('public/js/dialog/*')
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(replace('"/php', '"'))
        .pipe(replace("'/php", "'"))
        .pipe(gulp.dest(destPhpDir + 'js/dialog'));
    gulp.src('public/js/lib/*')
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(replace("window.STATIC = '/js/';", "window.STATIC = '/static/js/';"))
        .pipe(replace("window.ENV = 'java';", "window.ENV = 'php';"))
        .pipe(gulp.dest(destPhpDir + 'js/lib'))
    gulp.src('views/**/*.html')
        .pipe(swig({ defaults: { cache: false, varControls: ['{~', '~}'] } }))
        .pipe(replace("/css", "/static/css"))
        .pipe(replace("/js", "/static/js"))
        .pipe(replace("/img", "/static/img"))
        .pipe(gulp.dest(destPhpDir + '/views'))
});

gulp.task('default', ['php'])


/**
 * NAME 2016/7/4
 * DATE 2016/7/4
 * AUTHOR shangxinbo
 */

const gulp = require('gulp');
const less = require('gulp-less');
const cssmin = require('gulp-clean-css');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const swig = require('gulp-swig');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const seajsRev = require('gulp-seajs-rev');

var destPhpDir = 'E:/php_ark/public/static/';

gulp.task('php', function () {
    gulp.src('public/img/**/*')
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(gulp.dest(destPhpDir + 'img/'));
    gulp.src('public/css/**/*')
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(cssmin())
        .pipe(gulp.dest(destPhpDir + 'css/'));
    gulp.src('public/less/*.less')
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(less())
        .pipe(cssmin())
        .pipe(rev())
        .pipe(gulp.dest(destPhpDir + 'css/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(destPhpDir + 'rev/css/'));
    gulp.src('public/js/seajs-config.js')
        .pipe(gulp.dest(destPhpDir + 'js/'));
    gulp.src('public/js/modules/**/*.js',{base:'public/js'})
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(replace('"/php', '"'))
        .pipe(replace("'/php", "'"))
        .pipe(rev())
        .pipe(gulp.dest(destPhpDir + 'js'))
        .pipe(rev.manifest())
        .pipe(seajsRev({base:destPhpDir, configFile:'js/seajs-config.js'}));
    gulp.src('public/js/page/**/*.js',{base:'public/js'})
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(replace('"/php', '"'))
        .pipe(replace("'/php", "'"))
        .pipe(rev())
        .pipe(gulp.dest(destPhpDir + 'js'))
        .pipe(rev.manifest())
        .pipe(seajsRev({base:destPhpDir, configFile:'js/seajs-config.js'}))
        .pipe(gulp.dest(destPhpDir + 'rev/js/'));
    gulp.src('public/js/lib/*.swf')
        .pipe(gulp.dest(destPhpDir + 'js/lib'));
    gulp.src('public/js/lib/*.js')
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(replace("window.STATIC = '/js/';", "window.STATIC = '/static/js/';"))
        .pipe(replace("window.ENV = 'java';", "window.ENV = 'php';"))
        .pipe(gulp.dest(destPhpDir + 'js/lib'));
    return gulp.src('views/**/*.html')
        .pipe(swig({ defaults: { cache: false, varControls: ['{~', '~}'] } }))
        .pipe(replace("/css", "/static/css"))
        .pipe(replace("/js", "/static/js"))
        .pipe(replace("/img", "/static/img"))
        .pipe(gulp.dest(destPhpDir + '/views_tmp'));
});

//rely on 'php' result
gulp.task('rev', ['php'], function () {
   return  gulp.src([destPhpDir + 'rev/**/*.json', destPhpDir + 'views_tmp/**/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest(destPhpDir + '/views/'));
})

gulp.task('default', ['rev','php']);

