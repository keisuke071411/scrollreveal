const buble = require('rollup-plugin-buble')
const istanbul = require('rollup-plugin-istanbul')

module.exports = function (karma) {
	karma.set({
		frameworks: ['mocha', 'sinon-chai'],

		preprocessors: {
			'src/**/*.js': ['rollup'],
			'test/**/*.spec.js': ['rollup'],
		},

		files: [
			{ pattern: 'src/**/*.js', included: false },
			'test/**/*.spec.js',
		],

		rollupPreprocessor: {
			plugins: [
				buble(),
				istanbul({
					exclude: [
						'src/index.js',
						'src/instance/defaults.js',
						'test/**',
						'**/node_modules/**',
					],
					instrumenterConfig: {
						embedSource: true,
					},
				}),
			],
			sourceMap: 'inline',
			format: 'iife',
			moduleName: 'ScrollReveal',
		},

		colors: true,
		concurrency: 5,
		logLevel: karma.LOG_ERROR,
		singleRun: true,

		browserDisconnectTimeout: 60 * 1000,
		browserDisconnectTolerance: 1,
		browserNoActivityTimeout: 60 * 1000,
		captureTimeout: 4 * 60 * 1000,
	})

	if (process.env.TRAVIS) {
		const customLaunchers = require('./sauce.conf')

		karma.set({
			autoWatch: false,
			browsers: Object.keys(customLaunchers),
			coverageReporter: {
				type: 'lcovonly',
				dir: 'coverage/',
			},
			customLaunchers,
			reporters: ['dots', 'saucelabs', 'coverage'],
			sauceLabs: {
				testName: 'ScrollReveal',
				build: process.env.TRAVIS_BUILD_NUMBER || 'manual',
				tunnelIdentifier: process.env.TRAVIS_BUILD_NUMBER || 'autoGeneratedTunnelID',
			},
		})

	} else {
		process.env.PHANTOMJS_BIN = './node_modules/phantomjs-prebuilt/bin/phantomjs'
		karma.set({
			browsers: ['PhantomJS'],
			coverageReporter: {
				type: 'lcov',
				dir: 'coverage/',
			},
			reporters: ['mocha', 'coverage'],
		})
	}
}
