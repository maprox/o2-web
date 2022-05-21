/**
 * Url param store
 * @class O.x.notification.model.UrlParam
 * @extend Ext.data.Model
 */
C.define('O.x.notification.model.UrlParam', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'param', type: 'string'},
			{name: 'value', type: 'string'},
			{name: 'state', type: 'int', defaultValue: C.cfg.RECORD_IS_ENABLED}
		]
	}
});
