module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],

		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter')
		],

		client: {
			builtPaths: ['dist/src', 'dist/testing'],
			clearContext: false
		},

		files: [
			'node_modules/systemjs/dist/system.src.js',

			'node_modules/core-js/client/shim.js',
			'node_modules/reflect-metadata/Reflect.js',

			'node_modules/zone.js/dist/zone.js',
			'node_modules/zone.js/dist/long-stack-trace-zone.js',
			'node_modules/zone.js/dist/proxy.js',
			'node_modules/zone.js/dist/sync-test.js',
			'node_modules/zone.js/dist/jasmine-patch.js',
			'node_modules/zone.js/dist/async-test.js',
			'node_modules/zone.js/dist/fake-async-test.js',

			{ pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
			{ pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

			{ pattern: 'node_modules/@angular/**/*.js', included: false, watched: false },
			{ pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false },

			{ pattern: 'systemjs.config.js', included: false, watched: false },
			{ pattern: 'systemjs.config.extras.js', included: false, watched: false },
			'karma-test-shim.js', // optionally extend SystemJS mapping e.g., with barrels

			{ pattern: 'dist/src/**/*.js', included: false, watched: true },
			{ pattern: 'dist/testing/**/*.js', included: false, watched: true },

			{ pattern: 'src/**/*.ts', included: false, watched: false },
			{ pattern: 'dist/src/**/*.map.js', included: false, watched: false },
			{ pattern: 'testing/**/*.ts', included: false, watched: false },
			{ pattern: 'dist/testing/**/*.js', included: false, watched: false },
		],

		exclude: [],
		preprocessors: {},
		reporters: ['progress', 'kjhtml'],

		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: false
	})
};
