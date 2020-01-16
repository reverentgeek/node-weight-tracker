"use strict";

const bell = require( "@hapi/bell" );
const cookie = require( "@hapi/cookie" );

const isSecure = process.env.NODE_ENV === "production";

module.exports = {
	name: "auth",
	version: "1.0.0",
	register: async server => {

		await server.register( [ cookie, bell ] );

		// configure cookie authorization strategy
		server.auth.strategy( "session", "cookie", {
			cookie: {
				name: "okta-oauth",
				path: "/",
				password: process.env.COOKIE_ENCRYPT_PWD,
				isSecure // Should be set to true (which is the default) in production
			},
			redirectTo: "/authorization-code/callback", // If there is no session, redirect here
		} );

		server.auth.strategy( "okta", "bell", {
			provider: "okta",
			config: { uri: process.env.OKTA_ORG_URL },
			password: process.env.COOKIE_ENCRYPT_PWD,
			isSecure,
			location: process.env.HOST_URL,
			clientId: process.env.OKTA_CLIENT_ID,
			clientSecret: process.env.OKTA_CLIENT_SECRET
		} );

		server.auth.default( "session" );

		server.ext( "onPreResponse", ( request, h ) => {
			// Add authentication info to every view by default
			if ( request.response.variety === "view" ) {
				const auth = request.auth.isAuthenticated ? {
					isAuthenticated: true,
					isAnonymous: false,
					email: request.auth.artifacts.profile.email,
					firstName: request.auth.artifacts.profile.firstName,
					lastName: request.auth.artifacts.profile.lastName
				} : {
					isAuthenticated: false,
					isAnonymous: true
				};
				request.response.source.context.auth = auth;
			}
			return h.continue;
		} );

	}
};
