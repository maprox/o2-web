/**
 */
/**
 * @class O.register.SupplyForm
 */
C.utils.inherit('O.register.SupplyForm', {

	initComponent: function() {
		var me = this;
		this.callOverridden(arguments);

		var files = this.query('[action=file]');
		for (var i = 0, l = files.length; i < l; i++) {
			//files[i].down('#btnUpload').on({
			files[i].down('filefield').on({
				//click: function() {
				change: function() {
					var file = this,
						form = file.down('form'),
						fieldfile = file.down('filefield'),
						value = fieldfile.getValue();
					if (form.getForm().isValid() &&
						file.uploadedValue != value && value) {
						file.uploadedValue = value;
						me.setLoading(true);
						form.submit({
							url: '/register/upload/',
							//waitMsg: me.lngWaitMsg,
							success: function(formBasic, action) {
								me.setLoading(false);
								var answer = Ext.JSON
									.decode(action.response.responseText);
								if (answer.success) {
									file.down('#hash')
										.setValue(answer.hash);
									file.down('#extension')
										.setValue(answer.extension);
									Ext.apply(fieldfile, {
										allowBlank: true
									});
									fieldfile.addClass('uploaded');
								}
							},
							failure: function() {
								console.log('Uploading error')
								me.setLoading(false);
							}
						});
					}
				},
				scope: files[i]
			});
		}
	},

/**
	* Registration data gather
	*//*
	getSubmitValues: function(items) {
		var data = items.getFieldValues();
		data.addresslegal = this.fieldAddressLegal.getAddressId();
		data.addressactual = this.fieldAddressActual.getAddressId();

		return data;
	},*/

/**
	* Change of legal address handler.
	* If "same address" is checked, pass value to actual address field.
	*/
	legalAddressChanged: function() {
		if (this.checkboxAddress.getValue()) {
			this.setSameActualAddressAsLegal();
		}
	},

/**
	* Same address checkbox handler
	*/
	sameAddressChecked: function(field, checked) {

		if (checked) {

			// If not already the same
			if (this.fieldAddressLegal.getAddressId() !=
				this.fieldAddressActual.getAddressId()) {

				this.setSameActualAddressAsLegal();
			}

			this.checkboxAddress.originalValue = true;
			this.checkboxAddress.setValue(true);
			this.fieldAddressActual.disableButton();

		} else {
			this.checkboxAddress.originalValue = false;
			this.checkboxAddress.setValue(false);
			this.fieldAddressActual.enableButton();
		}
	},

/**
	* Sets actual address the same as legal
	*/
	setSameActualAddressAsLegal: function() {
		var address = this.fieldAddressLegal.getAddressId();
		if (address) {
			this.fieldAddressActual.setValue(address);
		}
	}
});
