var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

gulp.task('uglify', function() {
	return gulp.src('src/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('bulid/js'));
});

gulp.task('minifyCss', function() {
	return gulp.src('src/css/*.css')
		.pipe(minifyCss())
		.pipe(gulp.dest('bulid/css'));
});

gulp.task('default',['uglify', 'minifyCss']);