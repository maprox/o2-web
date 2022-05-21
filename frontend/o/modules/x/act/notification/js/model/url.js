/**
 * Url action store
 * @class O.x.notification.model.Url
 * @extend Ext.data.Model
 */
C.define('O.x.notification.model.Url', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'url', type: 'string'},
			{name: 'method', type: 'string'},
			{name: 'params', type: 'object'},
			{name: 'state', type: 'int', defaultValue: C.cfg.RECORD_IS_ENABLED}
		]
	}
});