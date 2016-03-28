var _ = require('lodash');

function ConfigManager(defaultConfig = {}) {
	function useWith(middlewares) {
		return function use(middleware) {
			if (middleware && _.isFunction(middleware.transform)) {
				// New array is required to keep internal states separate.
				var newMiddlewares = middlewares.concat(middleware);
				return {
					use: useWith(newMiddlewares),
					assemble: assembleWith(newMiddlewares)
				};
			} else {
				throw new Error('Invalid middleware used in ConfigManager.');
			}	
		}
	}
	
	function assembleWith(middlewares) {
		return function assemble() {
			var promise = Promise.resolve(defaultConfig);
			middlewares.forEach(middleware => {
				promise = promise.then(config => {
					return middleware.transform(config);
				});
			});
			return promise;	
		}
	}
	
	return {
		use: useWith([]),
		assemble: assembleWith([])	
	};
}

module.exports = ConfigManager;