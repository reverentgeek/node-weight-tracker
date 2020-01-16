"use strict";

const postgres = require( "postgres" );

module.exports = {
	name: "sql",
	version: "1.0.0",
	register: async server => {

		// create the sql client
		const sql = postgres();

		// add to the request toolkit e.g. h.sql
		server.decorate( "toolkit", "sql", sql );
	}
};
