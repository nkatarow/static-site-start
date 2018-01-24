var gulp = require ('gulp');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var del = require('del');
var livereload = require('gulp-livereload');
var replace = require('gulp-replace');
var imagemin = require('gulp-imagemin');
var iconfont = require('gulp-iconfont');
var iconfontCSS = require('gulp-iconfont-css');
var nunjucksRender = require('gulp-nunjucks-render');

var date = new Date();
var cssFilename = 'main.min.' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + '-' + date.getTime() + '.css';
var jsFilename = 'scripts.min.' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + '-' + date.getTime() + '.js';


function createErrorHandler(name) {
    return function (err) {
    	console.error('Error from ' + name, err.toString());
    };
}

// Iconfont Generation 
gulp.task('icons', function(){
  gulp.src(['_ui/img/icons/*.svg'])
    .pipe(iconfontCSS({
      fontName: 'iconfont',
      targetPath: '../scss/base/_icon-fonts.scss',
      fontPath: '../fonts/',
      path: 'scss'
    }))
    .pipe(iconfont({
      fontName: 'iconfont',
      formats: ['eot', 'woff', 'woff2'],
      normalize: true,
      fontHeight: 1001
    }))
    .pipe(gulp.dest('_ui/fonts/'))
});

// Cleaners
gulp.task('cleancompiled', function(){ return del(['app/_ui/compiled']); });
gulp.task('cleandist', function(){ return del(['app/_ui/dist']); });

// Concat/autoprefix CSS
gulp.task('styles', function(){
	return sass('src/_ui/sass/main.scss', { style: 'expanded'})
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(autoprefixer({browsers: ['last 2 version', 'safari 5', 'ie 9', 'ios 6', 'android 4', '> 1%']}))
		.pipe(gulp.dest('app/_ui/compiled'))
    	.on('error', createErrorHandler('styles task'))
		.pipe(livereload()
	);
});

// Concat JS
gulp.task('scripts', function(){
	return gulp.src(['src/_ui/js/lib/*.js', 'src/_ui/js/app.main.js', 'src/_ui/js/components/*.js'])
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest('app/_ui/compiled'))
    	.on('error', createErrorHandler('scripts task'))
		.pipe(livereload()
	);
});

// Minify / Uglify
gulp.task('minify', function(){
	return gulp.src('app/_ui/compiled/main.css')
		.pipe(cleanCSS())
		.pipe(rename(cssFilename))
		.pipe(gulp.dest('app/_ui/dist'))
    	.on('error', createErrorHandler('minify task')
	);
});
gulp.task('uglify', function(){
	return gulp.src('app/_ui/compiled/scripts.js')
		.pipe(rename(jsFilename))
		.pipe(uglify())
    	.on('error', createErrorHandler('uglify task'))
		.pipe(gulp.dest('app/_ui/dist')
	);
});

// Templates
gulp.task('nunjucksDev', ['styles', 'scripts'], function() {
	return gulp.src(['src/templates/*.nunjucks', 'src/templates/views/**/*.nunjucks'])
		.pipe(nunjucksRender({data: {
      path: 'compiled',
      cssFilename: 'main.css',
      jsFilename: 'scripts.js' // String or Array
    }}))
		.pipe(gulp.dest('app/'))
		.pipe(livereload());
});

var date = new Date();
var cssFilename = 'main.min.' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + '-' + date.getTime() + '.css';
var jsFilename = 'scripts.min.' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + '-' + date.getTime() + '.js';

gulp.task('nunjucksProd', ['minify', 'uglify'], function() {
	return gulp.src(['src/templates/*.nunjucks', 'src/templates/views/**/*.nunjucks'])
		.pipe(nunjucksRender({data: {
      path: 'dist',
      cssFilename: cssFilename,
      jsFilename: jsFilename // String or Array
    }}))
		.pipe(gulp.dest('app/'))
		.pipe(livereload());
});


// Default task
gulp.task('default', ['cleancompiled'], function(){
	gulp.start('styles', 'scripts', ['nunjucksDev']);
});


// Watch task
gulp.task('watch', function(){
	gulp.start('styles', 'scripts', ['nunjucksDev']);
  
  livereload.listen();
	
  // Icons
 	gulp.watch('src/_ui/img/icons/*.svg', ['icons']);

	// SASS/JS
 	gulp.watch('src/_ui/css/**/*.scss', ['styles']);
	gulp.watch('src/_ui/js/**/*.js', ['scripts']);

	// Templates
	gulp.watch([
		'src/templates/*.nunjucks',
		'src/templates/chrome/*.nunjucks',
		'src/templates/views/**/*.nunjucks',
		'src/templates/components/*.nunjucks'
	], ['nunjucksDev']); 
});


// Build task
gulp.task('build', ['cleandist'], function(){
	gulp.start('minify', 'uglify', ['nunjucksProd']);
});
