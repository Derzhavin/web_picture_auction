
const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const babelCore = require('babel-core');
const pug = require('gulp-pug');
const del = require('del');

gulp.task('cleanJs', () => del('./public/pageProcessing.js'));
gulp.task('makeJs', () => gulp.src('./pageProcessing.js').pipe(babel()).pipe(gulp.dest('./public/')));
gulp.task('cleanStyles', () => del('./public/styles/*.css'));
gulp.task('makeStyles', () => gulp.src('./styles/*.less').pipe(less()).pipe(gulp.dest('./public/styles/')));
gulp.task('default', gulp.parallel((gulp.series('cleanJs', 'makeJs')),(gulp.series('cleanStyles', 'makeStyles'))));