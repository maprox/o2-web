/**
 * Store for message objects
 * ===============================
 *
 * Description goes here
 *
 * @class C.store.Message
 * @extends Ext.data.Model
 */
Ext.define('C.store.Message', {
	extend: 'Ext.data.Store',
	config: {
		model: 'C.model.Message'
	},
	// remove if ExtJS using a config
	model: 'C.model.Message'
});
