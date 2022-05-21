/**
 *
 * @class O.window.EditAccountTariff
 * @extends Ext.window.Window
 */
C.define('O.billing.misc.MarkPaid', {
	extend: 'O.window.Billing',

/** Languages */
	title: _('Invoice payment date'),

/**
	* Constructor
	*/
	initComponent: function() {

		this.invoiceId = this.data.id;

		Ext.apply(this, {
			items: [{
				xtype: 'datepicker',
				name: 'value',
				minDate: this.data.sdt,
				maxDate: new Date(),
				showToday: false
			}]
		});

		this.callParent(arguments);

		/** Add save/cancel buttons */
		this.addDocked({
			xtype: 'toolbar',
			dock: 'bottom',
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			items: [{
				xtype: 'button',
				text: _('Save'),
				itemId: 'save',
				handler: this.markInvoiceAsPaid,
				scope: this
			}, {
				xtype: 'button',
				text: _('Cancel'),
				handler: this.destroy,
				scope: this
			}]
		});

		this.picker = this.down('datepicker');
		this.buttonSave = this.down('#save');

		this.show();
	}
});
