(function (global) {
	System.config({
		paths: {
			// paths serve as alias
			'npm:': 'node_modules/'
		},
		// map tells the System loader where to look for things
		map: {
			// our src
			src: 'src',

			// angular bundles
			'@angular/core': 'npm:@angular/core/bundles/core.umd.js',
			'@angular/common': 'npm:@angular/common/bundles/common.umd.js',
			'@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
			'@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
			'@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',

			// other libraries
			'rxjs': 'npm:rxjs',
		},
		// packages tells the System loader how to load when no filename and/or no extension
		packages: {
			src: {
				main: './index.js',
				defaultExtension: 'js'
			},
			rxjs: {
				defaultExtension: 'js'
			}
		}
	});
})(this);
