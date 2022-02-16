const gulp = require('gulp');
const plumber = require('gulp-plumber');
const gulpSass = require('gulp-sass');
const gulpBabel = require('gulp-babel');
const gulpConcat = require('gulp-concat');
const gulpPostCss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const gulpImageMin = require('gulp-imagemin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync');
const del = require('del');

const style = () =>
    gulp.src('./src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(gulpSass())
        .pipe(gulpPostCss([autoprefixer(), cssnano()]))
        .pipe(gulpConcat('main.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'))

const html = () => gulp.src('./src/*.html').pipe(gulp.dest('./dist'));

const script = () => gulp.src(['./node_modules/jquery/dist/jquery.min.js', './src/script/*.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(gulpBabel({ presets: ['@babel/preset-env'] }))
    .pipe(gulpConcat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'))


const image = () => gulp.src('./src/images/*')
    .pipe(gulpImageMin())
    .pipe(gulp.dest('./dist/images'))


const clean = () => del(['./dist']);

function watchFiles() {
    browserSync.init({
        server: './dist'
    });

    gulp.watch('./src/scss/*.scss', style).on('change', browserSync.reload);
    gulp.watch('./src/*.html', html).on('change', browserSync.reload);
    gulp.watch('./src/script/*.js', script).on('change', browserSync.reload);
    gulp.watch('./src/image/*', image).on('change', browserSync.reload);
}

const watch = gulp.series(clean, gulp.parallel(html, style, script, image), watchFiles);

exports.clean = clean;
exports.style = style;
exports.script = script;
exports.image = image;
exports.html = html;
exports.watch = watch;
