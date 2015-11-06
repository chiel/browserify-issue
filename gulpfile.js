'use strict';

var browserify = require('browserify');
var gulp       = require('gulp');

gulp.task('scripts', function() {
	var appBundler   = browserify('src/client/index.js');
	var loginBundler = browserify('src/modules/login/routes.js');

	appBundler.require(__dirname + '/src/client/index.js');
	loginBundler.external(appBundler);

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
