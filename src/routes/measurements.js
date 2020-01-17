"use strict";

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

module.exports = [ 
	listMeasurements,
	addMeasurements
];
