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

	var appBundler = browserify(bundleOpts)
		.add('./src/client/index.js', { expose: true })
		.external('modules/login');

	var loginBundler = browserify(bundleOpts)
		.external(appBundler)
		.require('./src/modules/login/routes.js', {
			expose: 'modules/login'
		});

	var bundlers = [ appBundler, loginBundler ];
	var outputs  = [ 'app.js', 'login.js' ];

	var streams = bundlers.map((bundler, index) => {
		return bundler.bundle()
			.pipe(require('vinyl-source-stream')(outputs[index]))
			.pipe(require('vinyl-buffer')())
			.pipe(gulp.dest('dist/js'));
	});

	return require('merge-stream')(streams);
});

gulp.task('default', [ 'scripts' ]);
