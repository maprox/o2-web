/**
 * @fileOverview Панель параметров
 */

C.define('O.form.ModelField', {
	extend: 'Ext.form.ComboBox',

	proxyId: '',

/**
	* @constructs
	*/
	initComponent: function() {
		this.proxy = O.manager.Model.getProxy(this.proxyId);
		if (this.proxy) {
			Ext.apply(this, {
				queryMode: 'local',
				triggerAction: 'all',
				valueField: 'id',
				displayField: 'name',
				editable: false,
				store: this.proxy.getStore()
			});
		}
		this.callParent(arguments);
	}
});