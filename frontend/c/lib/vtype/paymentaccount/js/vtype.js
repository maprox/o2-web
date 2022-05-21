if (C.utils.isset('Ext.form.field.VTypes')) {
	Ext.apply(Ext.form.field.VTypes, {
/**
		* login validator
		*/
		payment_account: function(val, field) {

			if (!field.lastRequest) {
				field.lastRequest = 0;
			}

			if (val == field.originalValue) {
				field.valid = true;
				field.clearInvalid();
				return true;
			}
			if (field.lastVal && field.lastVal == val) {
				if (!field.valid) {
					field.markInvalid(_('Already used'));
				}
				return field.valid;
			}
			field.lastRequest++;
			field.lastVal = val;
			var data = {
				account: val,
				request: field.lastRequest
			};
			Ext.Ajax.request({
				url: '/settings/checkaccount',
				params: {
					data: Ext.JSON.encode(data)
				},
				success: function(response) {
					var answer =
						C.utils.getJSON(response.responseText);
					if (answer.request < field.lastRequest) {
						return;
					}
					var result = false;
					if (answer.exists) {
						field.markInvalid(_('Already used'));
					} else {
						result = true;
						field.clearInvalid();
					}
					field.valid = result;
					field.isWaiting = false;
					field.fireEvent('validitychange', field, result);
				}
			});
			field.valid = false;
			field.isWaiting = true;
			field.markInvalid(_('Waiting for server'));
			field.fireEvent('validitychange', field, false);
			return true;
		}
	});
}