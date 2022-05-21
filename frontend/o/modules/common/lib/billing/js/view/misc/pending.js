/**
 * @class O.window.PendingPayment
 * @extends Ext.window.Window
 */
C.define('O.window.PendingPayment', {
	extend: 'O.window.Billing',

	width: 600,

/** Languages */
	title: 'Pending payment',
	pendingPaymentTpl: '<table class="payment_window"><tr>'+
			'<th>Payment № {id}</th>'+
			'<th>Payment date</th>'+
			'<th>Payment type</th>'+
			'<th>Money</th>'+
		'</tr><tr>'+
			'<td>Details: </td>'+
			'<td>{sdt}</td>'+
			'<td>{payment_name}</td>'+
			'<td>{amount}</td>'+
		'</tr><tr>'+
			'<td>Refill total: </td>'+
			'<td></td>'+
			'<td></td>'+
			'<td>{amount}</td>'+
	'</tr></table>',
	lngBtnPendingDo: 'Start payment',
	paymentErrorAlert: 'Payment type not implemented yet',

/**
	* Constructor
	*/
	initComponent: function() {

		/** Save incoming data */
		this.paymentData = this.data;

		/** Convert some values for displaying */
		var store = C.getStore('billing_payment_type'),
			record = store.getAt(store.find('id', this.data.id_payment_type));

		this.data.payment_name = record.get('name');
		this.data.sdt = Ext.util.Format.date(this.data.sdt, 'Y-m-d');

		/** Add template for correct language */
		Ext.apply(this, {
			tpl: new Ext.XTemplate(this.pendingPaymentTpl, {
				disableFormats: true
			})
		});

		this.callParent(arguments);

		/** Add start/cancel buttons */
		this.addDocked({
			xtype: 'toolbar',
			dock: 'bottom',
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			items: [{
				xtype: 'button',
				text: this.lngBtnPendingDo,
				handler: this.activateRefill,
				scope: this
			}, {
				xtype: 'button',
				text: _('Cancel'),
				handler: this.destroy,
				scope: this
			}]
		});

		this.show();
	}
});
