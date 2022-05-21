/**
 *
 * @class O.window.EditAccountLimit
 * @extends Ext.window.Window
 */
C.utils.inherit('O.billing.misc.MarkPaid', {

/**
 * @event invoice_paid
 * Fires on successful save
 */

/**
 * Saves changes to account limit, closes window
 */
	markInvoiceAsPaid: function() {

		this.setLoading(true);

		var params = {
			id: this.invoiceId,
			id_firm: this.firmid,
			paydt: Ext.Date.format(this.picker.getValue(), C.cfg.dbFormatDate),
			status: 3
		};

		Ext.Ajax.request({
			url: '/billing_invoice/',
			method: 'put',
			params: params,
			scope: this,
			success: function(response) {

				if (response) {

					var response = Ext.decode(response.responseText);

					if (response.success) {
						this.fireEvent('invoice_paid', params);
					}
				}

				this.destroy();
			},
			failure: function(response) {
				this.destroy();
			}
		});
	}
});
