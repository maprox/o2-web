/**
 * @class O.common.lib.billing.ExportWindow
 * @extends O.window.Billing
 */
C.define('O.common.lib.billing.ExportWindow', {
	extend: 'O.window.Billing',
	alias: 'widget.act-billing-exportwindow',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Export billing history'),
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			width: 300,
			height: 300,
			closeAction: 'hide',
			plain: true,
			items: [{
				xtype: 'datefield',
				itemId: 'fieldSdt',
				labelWidth: 80,
				anchor: '100%',
				fieldLabel: _('Starting with'),
				format: O.format.Date,
				name: 'period_sdt'
			}, {
				xtype: 'datefield',
				itemId: 'fieldEdt',
				labelWidth: 80,
				anchor: '100%',
				fieldLabel: _('Ending with'),
				format: O.format.Date,
				name: 'period_edt'
			}, {
				xtype: 'radiogroup',
				itemId: 'fieldFormat',
				labelAlign: 'top',
				fieldLabel: _('Format'),
				columns: 1,
				items: [{
					boxLabel: _('PDF'),
					iconCls: 'fmt-pdf',
					name: 'format',
					inputValue: 'PDF',
					checked: true
				}, {
					boxLabel: _('XLS (Excel)'),
					name: 'format',
					inputValue: 'XLS'
				}]
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				defaults: {
					xtype: 'button',
					alias: 'month',
					toggleGroup: 'month'
				},
				items: [
					{offset:  0},
					{offset: -1},
					{offset: -2},
					{offset: -3}
				]
			}],
			buttonAlign: 'center',
			buttons: [{
				text: _('Export'),
				itemId: 'btnExport',
				iconCls: 'print'
			}, {
				text: _('Cancel'),
				itemId: 'btnCancel',
				iconCls: 'cancel'
			}]
		});
		this.callParent(arguments);
		// init local variables
		this.btnExport = this.down('#btnExport');
		this.btnCancel = this.down('#btnCancel');
		this.fieldFormat = this.down('#fieldFormat');
		this.fieldSdt = this.down('#fieldSdt');
		this.fieldEdt = this.down('#fieldEdt');
	}
});