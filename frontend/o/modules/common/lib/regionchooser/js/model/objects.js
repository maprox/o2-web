/**
 * Region chooser object (with coordinates)
 * @class O.lib.regionchooser.Object
 * @extend Ext.data.Model
 */
C.define('O.lib.regionchooser.Object', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'lat', type: 'float'},
			{name: 'lng', type: 'float'}
		]
	}
});
