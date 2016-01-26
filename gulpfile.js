(function () {

  var gulp = require('gulp');
  var del = require('del');
  var uglify = require('gulp-uglify');
  var conf = {
    src: 'src',
    dist: 'dist'
  };

  gulp.task('clean', function () {
    del(conf.dist);
  });

  gulp.task('uglify', function () {
    gulp.src([
      conf.src + '/XMLHttpRequest.js',
      conf.src + '/Ajax.js'
    ])
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
  });

  gulp.task('default', ['clean', 'uglify']);

}());
