/**
 * @fileOverview Base geocoding class
 *
 * @class C.lib.map.Geocoder
 * @extends Ext.util.Observable
 */
Ext.define('C.lib.map.Geocoder', {
	extend: 'Ext.util.Observable',

/**
	* Geocoding-engine name
	* @type String
	* @private
	*/
	id: null,

/**
	* Geocoder object
	* @type Object
	* @protected
	*/
	geocoderObject: null,

/**
	* Check if geocoding engine is loaded
	* @return {Boolean} true, if engine is loaded
	*/
	isActive: function() {
		return !Ext.isEmpty(this.geocoderObject);
	},

/**
	* Initialization of engine
	* @protected
	*/
	init: Ext.emptyFn,

/**
	* Request for the geocode information
	* @param {String/Object} request Request data
	* @param {Object} callback Callback function
	*/
	geocode: function(request, callback) {
		// ...
	}
});
