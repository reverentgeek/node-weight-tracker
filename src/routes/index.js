"use strict";

const path = require( "path" );
const boom = require( "@hapi/boom" );
const api = require( "./api" );

const register = async server => {
	await api.register( server );

	server.route( {
		method: "GET",
		path: "/",
		options: {
			auth: {
				mode: "try"
			},
			handler: ( request, h ) => {
				return h.view( "index", {
					title: "Home",
					isAuthenticated: request.auth.isAuthenticated
				} );
			}
		}
	} );

	server.route( {
		method: "GET",
		path: "/list",
		handler: ( request, h ) => {
			return h.view( "list", { title: "Measurements" } );
		},
		config: {
			auth: {
				strategy: "session"
			}
		}
	} );

	server.route( {
		method: "GET",
		path: "/add",
		handler: ( request, h ) => {
			return h.view( "add", { title: "Add Measurement" } );
		}
	} );

	server.route( {
		method: "GET",
		path: "/login",
		options: {
			handler: request => {
				if ( !request.auth.isAuthenticated ) {
					return `Authentication failed due to: ${ request.auth.error.message }`;
				}
			}
		}
	} );

	server.route( {
		method: "GET",
		path: "/authorization-code/callback",
		handler: ( request, h ) => {
			if ( !request.auth.isAuthenticated ) {
				throw boom.unauthorized( `Authentication failed: ${ request.auth.error.message }` );
			}
			request.cookieAuth.set( request.auth.credentials );
			return h.redirect( "/" );
		},
		options: {
			auth: "okta"
		}
	} );

	server.route( {
		method: "GET",
		path: "/logout",
		handler: ( request, h ) => {
			try {
				if ( request.auth.isAuthenticated ) {
					// clear the local session
					request.cookieAuth.clear();
				}

				return h.redirect( "/" );
			} catch ( err ) {
				request.log( [ "error", "logout" ], err );
			}
		},
		options: {
			auth: {
				mode: "try"
			}
		}
	} );

	// routes for static assets
	server.route( {
		method: "GET",
		path: "/assets/{param*}",
		handler: {
			directory:{ 
				path: path.join( __dirname, "..", "assets" )
			}
		},
		options: { auth: false }
	} );
};

module.exports = {
	register
};
