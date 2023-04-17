'use strict'

const { task, parallel, watch, series, src, dest } = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const gulpif = require('gulp-if');
const yargs = require('yargs');
const fileInclude = require('gulp-file-include'); 
const argP = yargs.argv,
    production = !!argP.production;

task('serve', () => {
  return browserSync.init({
      server: {
          baseDir: ('./dist')
      },
      port: 9000,
      open: true
  })
})

task('cleanDist', () => {
  return src('./dist', { allowEmpty: true }).pipe(clean())
})

task('html', ()=>{

  return src('./src/*.html')

  .pipe(fileInclude())
  .pipe(gulpif(production, htmlmin({ collapseWhitespace: true })))
        .pipe(gulpif(production, rename({ suffix: ".min" })))
        .pipe(browserSync.stream())
  .pipe(dest('./dist'))

})

task('sass', ()=>{
  return src('./src/scss/style.scss')
  .pipe(sass().on("error", sass.logError))
  .pipe(gulpif(production, cleanCss()))
  .pipe(autoprefixer({
      grid: true,
      cascade: true,
      Browserslist: [
          "last 1 version",
          "> 1%"
      ]
  }))
  .pipe(gulpif(production, rename({ suffix: ".min" })))
  .pipe(browserSync.stream())
  .pipe(dest('./dist/css'))
})




task('img', () => {
  return src('./src/img/**/*')
      .pipe(imagemin())
      .pipe(browserSync.stream())
      .pipe(dest('./dist/img'));
})
task('js', () => {
  return src('./src/js/*.js')
      .pipe(concat('main.min.js'))
      .pipe(gulpif(production, terser()))
      .pipe(browserSync.stream())
      .pipe(dest('./dist/js/'));
})

task('watch',()=>{
  watch('./src/**/*.html', parallel('html')).on('change', browserSync.reload);;
  watch('./src/scss/**/*.scss', parallel('sass')).on('change', browserSync.reload);;
  watch('./src/js/**/*.js', parallel('js')).on('change', browserSync.reload);
  watch('./src/img/**/*', series('img')).on('change', browserSync.reload);
  watch('./dist/**/*.html').on('change', browserSync.reload);

})

task('build', series('cleanDist', parallel('html','js', 'img', 'sass')));

task('dev', series('build', parallel('serve','watch')));
  