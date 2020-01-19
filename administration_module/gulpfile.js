const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const babelCore = require('babel-core');
const pug = require('gulp-pug');
const del = require('del');

gulp.task('cleanJs', () => del('./public/JSPagesProcessing/*.js'));
gulp.task('makeJs', () => gulp.src('./JSPagesProcessing/*.js').pipe(babel()).pipe(gulp.dest('./public/JSPagesProcessing/')));
gulp.task('cleanStyles', () => del('./public/*.css'));
gulp.task('makeStyles', () => gulp.src('*.less').pipe(less()).pipe(gulp.dest('./public/')));
gulp.task('default', gulp.parallel((gulp.series('cleanJs', 'makeJs')),(gulp.series('cleanStyles', 'makeStyles'))));