/**
 * @class O.common.lib.shareaccess.ShareWindow
 * @extends Ext.window.Window
 */
C.define('O.common.lib.shareaccess.ShareWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.sharewindow',

/**
	* @constructor
	*/
	initComponent: function() {

		var form = Ext.widget('form', {
			bodyPadding: 10,
			preventHeader: true,
			border: false,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			defaults: {
				labelAlign: 'top',
				border: false
			},
			items: [{
				xtype: 'textfield',
				itemId: 'fieldKey',
				allowBlank: false,
				minLength: 4,
				msgTarget: 'side',
				fieldLabel: _('Please, enter share key'),
				name: 'inn'
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				items: [{
					xtype: 'tbfill'
				}, {
					itemId: 'btnShare',
					disabled: true,
					formBind: true,
					xtype: 'button',
					text: _('Grant access')
				}, {
					itemId: 'btnCancel',
					disabled: false,
					xtype: 'button',
					text: _('Cancel')
				}]
			}]
		});
		this.form = form;

		Ext.apply(this, {
			title: _('Grant access to firm'),
			width: 670,
			border: false,
			resizable: true,
			modal: true,
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [{
				xtype: 'panel',
				layout: 'fit',
				flex: 2,
				items: [form]
			}]
		});

		this.callParent(arguments);
	}
});