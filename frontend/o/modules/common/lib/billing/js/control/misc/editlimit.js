/**
 *
 * @class O.window.EditAccountLimit
 * @extends Ext.window.Window
 */
C.utils.inherit('O.window.EditAccountLimit', {

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
			'limit_changed'
		);
	},

/**
 * Saves changes to account limit, closes window
 */
	changeAccountLimit: function() {

		var data = {
			value: this.fieldValue.getValue(),
			date: this.fieldDate.getValue(),
			permanent: this.fieldPermanent.getValue() - 0,
			accountId: this.accountId
		};

		this.setLoading(true);

		Ext.Ajax.request({
			url: '/billing_account/changelimit',
			method: 'post',
			params: data,
			scope: this,
			success: function(response) {

				if (response) {

					var response = Ext.decode(response.responseText);

					if (response.data) {
						this.fireEvent('limit_changed', response.data);
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

		if (!this.fieldValue.getValue()) {
			this.buttonSave.disable();
			return;
		}

		if (!this.fieldDate.getValue() && !this.fieldPermanent.getValue()) {
			this.buttonSave.disable();
			return;
		}

		this.buttonSave.enable();
	},

/**
 * Checkbox clicked
 */
	onPermanentChange: function(checkbox, checked) {
		if (checked) {
			this.fieldDate.disable();
		} else {
			this.fieldDate.enable();
		}

		this.onValueChange();
	}
});
