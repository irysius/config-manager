# Config Manager

Relies on a global implementation of Promise.

This service assumes an application that takes a very particular shape, and may not be applicable for all purposes.

This service acts as an assembler of configuration sources, and will likely require the use of other modules.

## Installation

	$ npm install @irysius/config-manager
	
## Usage

To instantiate the manager:

	var startingConfig = {};
	var ConfigManager = require('@irysius/config-manager');
	var configManager = ConfigManager(startingConfig);
	
To use middleware with the manager:

	// the middleware instances conform to the interface ConfigMiddleware (see below)
	configManager
		.use(middlewareOne)
		.use(middlewareTwo)
		
To generate the configuration:

	configManager
		.use(middlewareOne)
		.use(middlewareTwo)
		.assemble().then(function (config) {
			// Use config
		});
	
## API
### interface ConfigMiddleware
	
	{
		transform: Object => Promise<Object>
	}

### constructor
`ConfigManager(startingConfig?: {})`

Constructor for the config manager.

### configManager.use
`configManager.use(ConfigMiddleware) => configManager`

### configManager.assemble
`configManager.assemble() => Promise<Object>`
