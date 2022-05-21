/**
 * @class O.common.lib.shareaccess.TransferWindow
 * @extends Ext.window.Window
 */
C.define('O.common.lib.shareaccess.TransferWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.transferwindow',

/**
	* @constructor
	*/
	initComponent: function() {

		var form = Ext.widget('form', {
			//bodyPadding: 10,
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
				//region: 'center',
				xtype: 'common-lib-modelslist-list',
				disabled: false,
				border: false,
				itemId: 'firmsList',
				managerAlias: 'x_firm',
				columns: [{
					dataIndex: 'company.name',
					flex: 1,
					field: {
						allowBlank: false
					}
				}],
				showButtonsToolbar: false,
				hideHeaders: true,
				enableShowDeleted: false,
				enableSearch: true,
				disallowEditing: true,
				vtype: this.vtype || '',
				height: 300
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				items: [{
					margin: '0 0 0 10',
					xtype: 'checkboxfield',
					boxLabel: _('Grant access after transfer'),
					name: 'share',
					itemId: 'checkboxShare',
					inputValue: '1',
					id: 'checkbox1',
					checked: true

				}, {
					xtype: 'tbfill'
				}, {
					itemId: 'btnTransfer',
					//formBind: true,
					disabled: true,
					xtype: 'button',
					text: _('Transfer')
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
			title: _('Transfer object to firm'),
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