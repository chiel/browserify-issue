'use strict';

var browserify = require('browserify');
var gulp       = require('gulp');

gulp.task('scripts', function() {
	var bundleOpts = {
		transform: [
			require('babelify').configure({
				presets: [ 'es2015' ]
			})
		]
	};

	var appBundler = browserify('./src/client/index.js', bundleOpts)
		.require('./src/client/index.js');

	return appBundler.bundle()
		.pipe(require('vinyl-source-stream')('app.js'))
		.pipe(require('vinyl-buffer')())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('default', [ 'scripts' ]);
