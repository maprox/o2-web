/**
 *
 * @class O.window.EditAccountTariff
 * @extends Ext.window.Window
 */
C.utils.inherit('O.window.EditAccountTariff', {

/**
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden(arguments);

		this.addEvents(
			/**
			 * @modified
			 * Fires on successful change
			 */
			'tariff_changed'
		);
	},

/**
 * Value changed
 */
	onValueChange: function(field, value) {
		this.newTariffId = value;

		if (this.newTariffId != this.currentTariffId) {
			this.buttonSave.enable();
		} else {
			this.buttonSave.disable();
		}
	},

/**
 * Saves changes to account limit, closes window
 */
	changeAccountTariff: function() {
		var data = {
			value: this.newTariffId,
			accountId: this.accountId
		};

		this.setLoading(true);

		Ext.Ajax.request({
			url: '/billing_account/changetariff',
			method: 'post',
			params: data,
			scope: this,
			success: function(response) {
				if (response) {

					var response = Ext.decode(response.responseText);

					if (response.data) {
						this.fireEvent('tariff_changed', response.data);
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


