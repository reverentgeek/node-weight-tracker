"use strict";

const Hapi = require( "@hapi/hapi" );
const registerPlugins = require( "./plugins" ).register;
const routes = require( "./routes" );

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
	server.route( routes );

	return server;
};

module.exports = {
	createServer
};
