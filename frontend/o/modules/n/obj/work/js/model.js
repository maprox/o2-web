/**
 * @class O.n.model.Work
 * @extends O.model.Object
 */
C.define('O.n.model.Work', {
	extend: 'O.model.Object',
	model: 'N.Work'
});

C.define('N.Work', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'message', type: 'string'},
			{name: 'deviceid', type: 'int'},
			{name: 'devicename', type: 'string'},
			{name: 'packetid', type: 'int'},
			{name: 'latitude', type: 'float'},
			{name: 'longitude', type: 'float'},
			{name: 'dt', type: 'date', convert: function(val) {
				// Костыли-костылики C.getStore создает пустую модель без значений, чтобы дернуть поля
				val = val ? val : '0000-00-00 00:00:00';
				return Ext.Date.parse(val.substr(0, 19), 'Y-m-d H:i:s');
			}},
			{name: 'date', type: 'string', convert: function(val, record) {
				return Ext.Date.format(record.get('dt'), 'd.m.Y');
			}},
			{name: 'time', type: 'string', convert: function(val, record) {
				return Ext.Date.format(record.get('dt'), 'H:i:s');
			}}
		]
	}
});
