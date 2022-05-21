/**
 *
 * @class O.window.PendingPayment
 * @extends Ext.window.Window
 */
C.utils.inherit('O.window.PendingPayment', {

/**
	* Sends user to payment form, according to chosen payment type
	*/
	activateRefill: function() {

		var payment_type = this.paymentData.id_payment_type - 0;

		switch (payment_type) {
			case 1:
				this.activateRefillWebmoney();
				break;
			case 3: case 4: case 5: case 6: case 7:
			case 8: case 9: case 10: case 11: case 12:
			case 13: case 14: case 15: case 16: case 17:
			case 18: case 19: case 20:
				this.activateRefillRBK();
				break;
			default:
				Ext.MessageBox.alert('', this.paymentErrorAlert);
				this.destroy();
				break;
		}

		this.destroy();
	},

/**
	* Sends user to webmoney payment form
	*/
	activateRefillWebmoney: function() {

		var params = '?amount=' + this.paymentData.amount +
			"&id=" + this.paymentData.id;

		window.open("/billing_invoice_webmoney/send" + params, "_newtab");
	},

/**
	* Sends user to RBK Money payment form
	*/
	activateRefillRBK: function() {
		var store = C.getStore('billing_payment_type'),
			record = store.getAt(store.find('id', this.paymentData.id_payment_type));

		var params = '?amount=' + this.paymentData.amount +
			"&id=" + this.paymentData.id +
			"&preference=" + record.get('param') +
			"&uid=" + C.utils.generateUid();

		window.open("/billing_invoice_rbkmoney/send" + params, "_newtab");
	}
});
