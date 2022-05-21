/**
 * Store for grid of acts
 * @class O.common.lib.billing.data.Act
 * @extend Ext.data.Store
 */
C.define('O.common.lib.billing.data.Act', {
	extend: 'Ext.data.Store',
	model: 'Dn.Act',
	autoLoad: false,
	remoteSort: true,
	proxy: {
		type: 'rest',
		url: '/dn_act',
		reader: {
			type: 'json',
			root: 'data',
			totalProperty: 'count'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			root: 'data'
		}//,
		//extraParams: {}
	},
	sortOnLoad: true,
	sorters: {
		property: 'dt',
		direction : 'DESC'
	}
});
