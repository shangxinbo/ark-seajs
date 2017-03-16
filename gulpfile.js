
'use strict'

const gulp = require('gulp')
const plumber = require('gulp-plumber')
const gulpif = require('gulp-if')
const less = require('gulp-less')
const cssmin = require('gulp-clean-css')
const replace = require('gulp-replace')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')
const swig = require('gulp-swig')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const seajsRev = require('gulp-seajs-rev')
const config = require('./config.json')

let destPhpDir = config ? config.php_code_path : 'D:/php_ark/public/static/'
let deployServerDir = '/static'

let release = process.argv.slice(2).indexOf('--release') >= 0 ? true : false

gulp.task('assets', () => {
    gulp.src('public/img/**/*')
        .pipe(plumber({ errorHandler: errorHandle }))
        .pipe(gulp.dest(destPhpDir + 'img/'))
    gulp.src('public/css/**/*')
        .pipe(plumber({ errorHandler: errorHandle }))
        .pipe(cssmin())
        .pipe(gulp.dest(destPhpDir + 'css/'))
    gulp.src('public/less/*.less')
        .pipe(plumber({ errorHandler: errorHandle }))
        .pipe(less())
        .pipe(cssmin())
        .pipe(gulpif(release, rev()))
        .pipe(gulp.dest(destPhpDir + 'css/'))
        .pipe(gulpif(release, rev.manifest()))
        .pipe(gulpif(release, gulp.dest(destPhpDir + 'rev/css/')))
    gulp.src('public/fonts/*')
        .pipe(plumber({ errorHandler: errorHandle }))
        .pipe(gulp.dest(destPhpDir + 'fonts/'))
    gulp.src('public/*.ico')
        .pipe(plumber({ errorHandler: errorHandle }))
        .pipe(gulp.dest(destPhpDir))
})

gulp.task('less',()=>{
    gulp.src('public/less/*.less')
        .pipe(plumber({ errorHandler: errorHandle }))
        .pipe(less())
        .pipe(gulp.dest('public/css/'))
})

gulp.task('js', () => {
    //第三方类库原样输出
    gulp.src('public/js/lib/**/*')
        .pipe(plumber({ errorHandler: errorHandle }))
        .pipe(gulp.dest(destPhpDir + 'js/lib'))
    gulp.src('public/js/seajs-config.js')
        .pipe(replace('/js/', deployServerDir + '/js/'))
        .pipe(gulp.dest(destPhpDir + 'js/'))
    //保证依赖关系，要有return
    return gulp.src('public/js/!(lib)/**/*.js')
        .pipe(plumber({ errorHandler: errorHandle }))
        .pipe(gulpif(release, uglify()))
        .pipe(gulpif(release, rev()))
        .pipe(gulp.dest(destPhpDir + 'js/'))
        .pipe(gulpif(release, rev.manifest()))
        .pipe(gulpif(release, seajsRev({ base: destPhpDir, configFile: 'js/seajs-config.js' })))
        .pipe(gulpif(release, gulp.dest(destPhpDir + 'rev/js/')))
})

gulp.task('html', () => {
    //保证依赖关系，要有return 
    return gulp.src('views/**/*.html')
        .pipe(swig({ defaults: { cache: false, varControls: ['{~', '~}'] } }))
        .pipe(replace('/css', deployServerDir + '/css'))
        .pipe(replace('/js', deployServerDir + '/js'))
        .pipe(replace('/img', deployServerDir + '/img'))
        .pipe(gulpif(release, htmlmin({ collapseWhitespace: true })))
        .pipe(gulpif(release, gulp.dest(destPhpDir + '/views_tmp')))
        .pipe(gulpif(!release, gulp.dest(destPhpDir + '/views')))
})

gulp.task('watch', ['less'])

gulp.task('default', ['assets', 'js', 'html'], function () {
    if (release) {
        gulp.src([destPhpDir + 'rev/**/*.json', destPhpDir + 'views_tmp/**/*.html'])
            .pipe(revCollector())
            .pipe(gulp.dest(destPhpDir + '/views/'))
    }
})

function errorHandle(err) {
    console.log(err)
    this.emit('end')
}