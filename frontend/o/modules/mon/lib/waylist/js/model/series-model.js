/**
 * @class Mon.WaylistSeries
 * @extends Ext.data.Model
 */
C.define('Mon.WaylistSeries', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'name', type: 'string'},
			{name: 'num', type: 'int'}
		]
	}
});
