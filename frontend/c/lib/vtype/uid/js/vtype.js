if (C.utils.isset('Ext.form.field.VTypes')) {
	Ext.apply(Ext.form.field.VTypes, {
/**
		* UID validator
		*/
		uid: function(val, field) {
			// field initialization
			if (!field.lastRequest) {
				field.lastRequest = 0;
			}

			if (val.length < 8) {
				field.valid = false;
				//field.markInvalid(_('Less then 8 chars'));
				field.lastValidateResult = false;
				field.removeCls('validation-loading');
				return false;
			}

			if (field.originalValue == val) {
				field.lastValidatedValue = val;
				field.lastValidateResult = true;
				return true;
			}

			if (
				field.lastValidatedValue === val &&
				!Ext.isEmpty(field.lastValidateResult)
			) {
				field.valid = field.lastValidateResult;
				return field.lastValidateResult;
			}

			field.lastValidatedValue = val;
			field.lastRequest++;

			Ext.Ajax.request({
				url: '/mon_device/checkuid',
				method: 'GET',
				params: {
					uid: val,
					request: field.lastRequest
				},
				success: function(response, opt) {
					var answer = C.utils.getJSON(response.responseText);
					if (answer.request < field.lastRequest) { return; }
					field.valid = !answer.exists;
					if (field.valid) {
						field.clearInvalid();
					} else {
						field.markInvalid(_('Already exists'));
					}
					field.lastValidateResult = field.valid;
					field.wasValidated = true;
					field.removeCls('validation-loading');
					field.isWaiting = false;
					// Validate field again
					field.validate();
				}
			});

			field.addCls('validation-loading');
			field.lastValidatedValue = val;
			field.lastValidateResult = false;
			field.valid = false;
			field.isWaiting = true;
			return false;
		},
		uidMask: /[a-z\d-_]/
	});
}