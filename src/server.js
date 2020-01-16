"use strict";

const Hapi = require( "@hapi/hapi" );
const registerPlugins = require( "./plugins" ).register;
const registerRoutes = require( "./routes" ).register;

const createServer = async config => {

	const server = Hapi.server( {
		port: config.port,
		host: config.host,
		routes: {
			validate: {
				failAction: ( request, h, err ) => {
					throw err;
				}
			}
		}
	} );

	await registerPlugins( server, config );
	await registerRoutes( server, config );

	return server;
};

module.exports = {
	createServer
};
