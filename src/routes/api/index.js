"use strict";

const boom = require( "@hapi/boom" );
const joi = require( "@hapi/joi" );

// add a new measurement for the current user
const addMeasurementForCurrentUser = {
	method: "POST",
	path: "/api/measurements",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const { measureDate, weight } = request.payload;
			const res = await h.sql`INSERT INTO measurements
				( user_id, measure_date, weight )
				VALUES
				( ${ userId }, ${ measureDate }, ${ weight } )
		
				RETURNING
					id
					, measure_date AS "measureDate"
					, weight`;
			return res.count > 0 ? res[0] : boom.badRequest();
		} catch ( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" },
		validate: {
			payload: joi.object( {
				measureDate: joi.date(),
				weight: joi.number()
			} )
		}
	}
};

// retrieve all measurements for the current user
const allMeasurementsForCurrentUser = {
	method: "GET",
	path: "/api/measurements",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const measurements = await h.sql`SELECT
					id
					, measure_date AS "measureDate"
					, weight
				FROM  measurements
				WHERE user_id = ${ userId }
				ORDER BY
					measure_date`;
			return measurements;
		} catch ( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" }
	}
};

// delete a measurement for the current user by id
const deleteMeasurementForCurrentUserById = {
	method: "DELETE",
	path: "/api/measurements/{id}",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const id = request.params.id;
			const res = await h.sql`DELETE
				FROM  measurements
				WHERE id = ${ id }
					AND user_id = ${ userId }`;
			return res.count > 0 ? h.response().code( 204 ) : boom.notFound();
		}
		catch( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" },
		validate: {
			params: joi.object( {
				id: joi.number().integer()
			} )
		}
	}
};

// get one measurement for the current user by id
const getMeasurementForCurrentUserById = {
	method: "GET",
	path: "/api/measurements/{id}",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const id = request.params.id;
			const res = await h.sql`SELECT
				id
				, measure_date AS "measureDate"
				, weight
			FROM  measurements
			WHERE user_id = ${ userId }
				AND id = ${ id }`;
			return res.count > 0 ? res[0] : boom.notFound();
		} catch ( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" },
		validate: {
			params: joi.object( {
				id: joi.number().integer().message( "id parameter must be number" )
			} )
		}
	}
};

// update a measurement for the current user by id
const updateMeasurementForCurrentUserById = {
	method: "PUT",
	path: "/api/measurements/{id}",
	handler: async ( request, h ) => {
		try {
			if ( !request.auth.isAuthenticated ) {
				return boom.unauthorized();
			}
			const userId = request.auth.credentials.profile.id;
			const id = request.params.id;
			const { measureDate, weight } = request.payload;
			const res = await h.sql`UPDATE measurements
				SET measure_date = ${ measureDate }
					, weight = ${ weight }
				WHERE id = ${ id }
				AND user_id = ${ userId }

				RETURNING
				id
				, measure_date AS "measureDate"
				, weight`;
			return res.count > 0 ? res[0] : boom.notFound();
		}
		catch( err ) {
			console.log( err );
			return boom.serverUnavailable();
		}
	},
	options: {
		auth: { mode: "try" },
		validate: {
			params: joi.object( {
				id: joi.number().integer()
			} ),
			payload: joi.object( {
				measureDate: joi.date(),
				weight: joi.number()
			} )
		}
	}
};

module.exports = [
	addMeasurementForCurrentUser,
	allMeasurementsForCurrentUser,
	deleteMeasurementForCurrentUserById,
	getMeasurementForCurrentUserById,
	updateMeasurementForCurrentUserById
];
