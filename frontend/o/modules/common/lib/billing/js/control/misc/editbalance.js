/**
 *
 * @class O.window.EditAccountBalance
 * @extends Ext.window.Window
 */
C.utils.inherit('O.window.EditAccountBalance', {

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
			'balance_changed'
		);
	},

/**
 * Saves changes to account limit, closes window
 */
	changeAccountBalance: function() {

		var data = {
			value: this.fieldValue.getValue(),
			type: this.fieldType.getValue(),
			note: this.fieldNote.getValue(),
			accountId: this.accountId
		};

		this.setLoading(true);

		Ext.Ajax.request({
			url: '/billing_account/changebalance',
			method: 'post',
			params: data,
			scope: this,
			success: function(response) {

				if (response) {

					var response = Ext.decode(response.responseText);

					if (response.data) {
						this.fireEvent('balance_changed', response.data);
					}
				}

				this.destroy();
			},
			failure: function(response) {
				this.destroy();
			}
		});
	},

/**
 * Value changed
 */
	onValueChange: function() {

		if (!(this.fieldValue.getValue() - 0)) {
			this.buttonSave.disable();
			return;
		}

		if (!(this.fieldType.getValue())) {
			this.buttonSave.disable();
			return;
		}

		this.buttonSave.enable();
	}
});
