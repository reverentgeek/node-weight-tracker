"use strict";

const path = require( "path" );
const api = require( "./api" );
const auth = require( "./auth" );

const home = {
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
};

const listMeasurements = {
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
};

const addMeasurements = {
	method: "GET",
	path: "/add",
	handler: ( request, h ) => {
		return h.view( "add", { title: "Add Measurement" } );
	}
};

const staticAssets = {
	method: "GET",
	path: "/assets/{param*}",
	handler: {
		directory:{ 
			path: path.join( __dirname, "..", "assets" )
		}
	},
	options: { auth: false }
};

const error404 = {
	method: "*",
	path: "/{any*}",
	handler: function ( request, h ) {
		return h.view( "404", { title: "Not Found" } ).code( 404 );
	},
	options: { auth: false }
};

module.exports = [
	home,
	listMeasurements,
	addMeasurements,
	staticAssets,
	error404
].concat( api, auth );
