/* global describe, it, before, after, __dirname */
if (typeof Promise === 'undefined') {
	require('babel-polyfill');
	console.info('Using babel-polyfill');	
}

var expect = require('chai').expect;
var _ = require('lodash');
var ConfigManager = require('./../dist/ConfigManager');

var nameMiddleware = {
	transform: function (config) {
		var newConfig = _.assign({}, config, { name: 'foobar' });
		return Promise.resolve(newConfig);
	} 
};
var alternateNameMiddleware = {
	transform: function (config) {
		var newConfig = _.assign({}, config, { name: 'barbaz' });
		return Promise.resolve(newConfig);
	} 
};
var infoMiddleware = {
	transform: function (config) {
		var newConfig = _.assign({}, config, { info: 'abcdefg' });
		return Promise.resolve(newConfig);
	} 
};
var colorMiddleware = {
	transform: function (config) {
		var newConfig = _.assign({}, config, { color: 'blue' });
		return Promise.resolve(newConfig);
	}
};

describe('config-manager', function () {
	it('should be able to assemble a default config', function (done) {
		var defaultConfig = { alpha: 'bravo' };
		var targetConfig = { alpha: 'bravo' };
		
		configManager = ConfigManager(defaultConfig);
		configManager.assemble().then(function (config) {
			expect(config).to.eql(targetConfig);
		}).then(function () {
			done();
		}).catch(function (err) {
			done(err);
		});
	});
	
	it('should be able to use middleware to alter the config', function (done) {
		var defaultConfig = { alpha: 'bravo' };
		var targetConfig = { alpha: 'bravo', name: 'foobar', info: 'abcdefg' };
		
		configManager = ConfigManager(defaultConfig);
		configManager
			.use(nameMiddleware)
			.use(infoMiddleware)
			.assemble().then(function (config) {
				expect(config).to.eql(targetConfig);
			}).then(function () {
				done();
			}).catch(function (err) {
				done(err);
			});
	});
	
	it('should be respect the order in which the middlewares are used', function (done) {
		var defaultConfig = { alpha: 'bravo' };
		var targetConfig = { alpha: 'bravo', name: 'barbaz' };
		
		configManager = ConfigManager(defaultConfig);
		configManager
			.use(nameMiddleware)
			.use(alternateNameMiddleware)
			.assemble().then(function (config) {
				expect(config).to.eql(targetConfig);
			}).then(function () {
				done();
			}).catch(function (err) {
				done(err);
			});
	});
	
	it('should be capable of storing separate middleware states depending on how you chain them', function (done) {
		var defaultConfig = { alpha: 'bravo' };
		var targetConfigOne = { alpha: 'bravo', name: 'foobar', info: 'abcdefg' };
		var targetConfigTwo = { alpha: 'bravo', name: 'foobar', color: 'blue' };
		
		configManager = ConfigManager(defaultConfig);
		configManager = configManager.use(nameMiddleware);
		Promise.all([
			configManager.use(infoMiddleware).assemble(),
			configManager.use(colorMiddleware).assemble()
		]).then(function (x) {
			var configOne = x[0], configTwo = x[1];
			expect(configOne).to.eql(targetConfigOne);
			expect(configTwo).to.eql(targetConfigTwo);
		}).then(function () {
			done();
		}).catch(function (err) {
			done(err);
		});
	});
});