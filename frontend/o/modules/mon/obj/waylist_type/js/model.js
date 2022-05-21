/**
 * @fileOverview Types for waylists
 *
 * @class O.mon.model.waylist.Type
 * @extends O.model.Object
*/

C.define('O.mon.model.waylist.Type', {
	extend: 'O.model.Object',
	model: 'Mon.Waylist.Type'
});

C.define('Mon.Waylist.Type', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'state', type: 'int'},
			{name: 'alias', type: 'string'}
		]
	}
});
