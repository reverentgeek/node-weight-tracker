"use strict";

const addMeasurements = {
	method: "GET",
	path: "/add",
	handler: ( request, h ) => {
		return h.view( "add", { title: "Add Measurement" } );
	}
};

const listMeasurements = {
	method: "GET",
	path: "/list",
	handler: ( request, h ) => {
		return h.view( "list", { title: "Measurements" } );
	}
};

module.exports = [ 
	listMeasurements,
	addMeasurements
];
