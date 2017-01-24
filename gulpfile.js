const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
  const tsResult = tsProject.src()
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(tsProject());
  return tsResult.js
    .pipe(sourcemaps.write('.', {sourceRoot: '.'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['scripts'], () => {
  gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('default', ['watch']);