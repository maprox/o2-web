/**
 * Geofence model object
 * @class O.mon.model.Geofence
 * @extends O.model.Object
 */
C.define('O.mon.model.Geofence', {
	extend: 'O.model.Object',
	model: 'Mon.Geofence',
	statics: {
		TYPE_POLYGON: 1,
		TYPE_CIRCLE: 2
	},

/**
	* @constructs
	*/
	constructor: function() {
		this.callParent(arguments);
		this.coordsAdd(this.coords);
	},

/**
	* Method of adding coordinates to the geofence
	* @param {O.mon.model.Coord[]} coords
	*/
	coordsAdd: function(coords) {
		if (!coords || !Ext.isArray(coords)) { return; }
		var list = this.getCoordinates();
		list.clear();
		Ext.each(coords, function(coord, index) {
			list.add(index, new O.mon.model.Coord(coord));
		});
	},

/**
	* Return a list of geofence coordinates
	* @return {Ext.util.MixedCollection}
	*/
	getCoordinates: function() {
		if (!this.list || Ext.isEmpty(this.list)) {
			this.list = new Ext.util.MixedCollection();
		}
		return this.list;
	},

/**
	* Функция перебора всех координат геозоны и вызова
	* функции <i>fn</i> для каждой.
	* @param {Function} fn Функция, вызываемая для каждого объекта
	* @param {Object} scope [опц.] Область видимости вызова
	* @returns {O.mon.model.Geofence} this
	*/
	each: function(fn, scope) {
		this.getCoordinates().each(function(coord) {
			return fn.call(scope || this, coord, this);
		}, this);
		return this;
	},

/**
	* Вызывается при обновлении геозоны на сервере
	* @param {Object} data
	*/
	set: function(data) {
		this.callParent(arguments);
		this.coordsAdd(data.coords);
		return true;
	}

});

C.define('Mon.Geofence', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'address', type: 'string'},
			{name: 'id_type', type: 'int'},
			{name: 'id_mode', type: 'int'},
			{name: 'color', type: 'string'},
			{name: 'inside'},
			{name: 'center_lat'},
			{name: 'center_lon'},
			{name: 'note', type: 'string'},
			{name: 'coords'},
			{name: 'is_garage', type: 'int'},
			{name: 'state', type: 'int'},

			{name: 'iseditable', type: 'boolean', defaultValue: true },
			{name: 'isshared', type: 'boolean'},
			{name: 'foreign', type: 'boolean'},
			{name: '$accesslist', type: 'object', persist: false}

		]
	}
});

C.onload(function() {
	var store = C.getStore('mon_geofence', {
		storeId: 'mon_geofence_garage',
		filters: [{
			property: 'is_garage',
			value: 1
		}]
	});
	store.filter();
});