// vim: noet sts=4 ts=4 sw=4
"use strict";
module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-ts');

	grunt.initConfig({
		ts: {
			build: {
				src: [
					'refs/common.d.ts',
					'src/util.ts',
					'src/settings.ts',
					'src/State.ts',
					'src/main.ts'
				],
				out: 'app/js/app.js',
				options: {
					target: 'es5',
					sourceMap: false,
					declaration: false,
					comments: true,
					noImplicitAny: true
				}
			}
		}
	});

	grunt.registerTask('default', ['ts']);
}
