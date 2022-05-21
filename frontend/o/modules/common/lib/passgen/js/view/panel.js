/**
 * generate password button
 * @class O.common.lib.Passgen
 * @extends Ext.panel.Panel
 */
C.define('O.common.lib.Passgen', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.passgen',

	border: false,

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [{
				xtype: 'button',
				itemId: 'btnPassgen',
				text: _('Generate password'),
				iconCls: 'btn_passgen'
			}, {
				xtype: 'panel',
				itemId: 'passStr',
				html: '',
				//height: 20,
				margin: '5 0 0 0'
			}]
		});
		this.callParent(arguments);

		this.btnPassgen = this.down('#btnPassgen');
		this.passStr = this.down('#passStr');
	}
});
