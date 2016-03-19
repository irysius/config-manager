/* global describe, it, before, after, __dirname */
if (typeof Promise === 'undefined') {
	require('babel-polyfill');
	console.info('Using babel-polyfill');	
}

var expect = require('chai').expect;
var ConfigManager = require('./../dist/ConfigManager');

describe('config-manager', function () {
	it('is something', function (done) {
		
	});
	
});