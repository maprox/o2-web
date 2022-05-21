/**
 * @class O.common.lib.billing.CreateActWindow
 * @extends O.window.Billing
 */
C.define('O.common.lib.billing.CreateActWindow', {
	extend: 'O.window.Billing',
	alias: 'widget.act-billing-createactwindow',

/**
	* @constructor
	*/
	initComponent: function() {
		var padding = 10;
		Ext.apply(this, {
			title: _('Create act'),
			layout: 'fit',
			bodyPadding: padding,
			width: 250,
			closeAction: 'hide',
			plain: true,
			items: [{
				xtype: 'datefield',
				itemId: 'fieldDate',
				labelAlign: 'top',
				anchor: '100%',
				fieldLabel: _('Issue date (need to select the ' +
					'last day of the month)'),
				format: O.format.Date
			}],
			buttonAlign: 'center',
			buttons: [{
				text: _('Create'),
				itemId: 'btnCreate',
				iconCls: 'btn-ok'
			}, {
				text: _('Cancel'),
				itemId: 'btnCancel',
				iconCls: 'cancel'
			}]
		});
		this.callParent(arguments);
		// init local variables
		this.btnCreate = this.down('#btnCreate');
		this.btnCancel = this.down('#btnCancel');
		this.fieldDate = this.down('#fieldDate');
	}
});