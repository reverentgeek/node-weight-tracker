"use strict";

const dotenv = require( "dotenv" );
const postgres = require( "postgres" );

const init = async () => {
	// read environment variables
	dotenv.config();
  
	try {
		// connect to the local database server
		const sql = postgres();

		await sql`DELETE FROM measurements WHERE user_id = '1234'`;
		const res = await sql`SELECT * FROM measurements`;

		console.log( res );

		await sql.end();
	} catch ( err ) {
		console.log( err );
		throw err;
	}
};

init();
