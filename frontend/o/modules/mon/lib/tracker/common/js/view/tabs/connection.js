/**
 * @class O.mon.lib.tracker.common.tab.Connection
 * @extends O.mon.lib.tracker.abstract.tab.Connection
 */

Ext.define('O.mon.lib.tracker.common.tab.Connection', {
	extend: 'O.mon.lib.tracker.abstract.tab.Connection', // abstract
	alias: 'widget.mon-lib-tracker-common-tab-connection',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'anchor',
			autoScroll: true,
			defaultType: 'textfield',
			items: [{
				xtype: 'panel',
				itemId: 'connectionPanel',
				border: false,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				width: 400,
				defaults: {
					xtype: 'textfield',
					labelAlign: 'top',
					anchor: '100%'
				},
				items: [{
					name: this.itemId + '.identifier',
					itemId: this.itemId + '.identifier',
					fieldLabel: _('Device IMEI'),
					vtype: 'uid',
					msgTarget: 'side'//,
					//allowBlank: false
				}, {
					name: this.itemId + '.phone',
					itemId: this.itemId + '.phone',
					fieldLabel: _('SIM number')
				}, {
					xtype: 'combobox',
					name: this.itemId + '.provider',
					itemId: this.itemId + '.provider',
					fieldLabel: _('Mobile network operator'),
					store: 'store-x_provider',
					displayField: 'name',
					valueField: 'id',
					editable: false,
					queryMode: 'local'
				}, {
					name: this.itemId + '.apn',
					fieldLabel: _('APN')
				}, {
					name: this.itemId + '.login',
					fieldLabel: _('Login')
				}, {
					name: this.itemId + '.password',
					fieldLabel: _('Password')
				}]
			}]
		});

		this.callParent(arguments);
	}
});
