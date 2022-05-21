/**
 * @class O.x.lib.company.tab.Props
 */
C.utils.inherit('O.x.lib.company.tab.Props', {

	/**
	 * @constructor
	 */
	initComponent: function() {
		this.callOverridden(arguments);
		this.on('recordload', this.initCheckboxValue, this);
		this.checkboxAddress.on({
			change: this.sameAddressChecked,
			scope: this
		});
		this.fieldAddressLegal.on({
			change: this.legalAddressChanged,
			scope: this
		});
	},

	/**
	 * Loads data from record
	 * @param {Ext.data.Model} record
	 * @param {Boolean} noReset (optional) If true, use field.setValue method
	 *     for forms to disable dirty change. Defaults to false
	 */
	selectRecord: function(record, noReset) {
		// @TODO: This hack is needed because of lacking tools
		// for defining "address field" inside "object field".
		// Remove when it is not needed anymore.
		if (record) {
			this.fieldAddressActual.setValue();
			this.fieldAddressLegal.setValue();
			this.fieldAddressActual.currentId = null;
			this.fieldAddressLegal.currentId = null;

			var company = record.get('company');
			if (!company) {
				company = record.getData();
			}
			var store = C.getStore('a_address');
			if (company.id_address_legal) {
				store.addItem({id: company.id_address_legal,
					fullname: company['id_address_legal$fullname']});
			}
			if (company.id_address_physical) {
				store.addItem({id: company.id_address_physical,
					fullname: company['id_address_physical$fullname']});
			}
		}
		this.callOverridden(arguments);
	},

	/**
	 * Sets checkbox value according to loaded record
	 */
	initCheckboxValue: function() {
		var r = this.getSelectedRecord()
		var value = (this.fieldAddressLegal.getAddressId() &&
			this.fieldAddressActual.getAddressId() ==
				this.fieldAddressLegal.getAddressId());

		this.checkboxAddress.originalValue = value;
		this.checkboxAddress.setValue(value);

		if (value) {
			this.fieldAddressActual.disableButton();
		}
	},

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
	},

	/**
	 * Resets data
	 */
	reset: function() {
		this.callParent(arguments);
		// Get selected record
		var record = this.getSelectedRecord();
		if (record) {
			this.fieldAddressLegal.setValue(
				this.fieldAddressLegal.originalValue
			);
			this.fieldAddressActual.setValue(
				this.fieldAddressActual.originalValue
			);
			this.fieldAddressLegal.value
				= this.fieldAddressLegal.originalValue;
			this.fieldAddressActual.value
				= this.fieldAddressActual.originalValue;

			this.fieldAddressLegal.currentId
				= this.fieldAddressLegal.originalValue;
			this.fieldAddressActual.currentId
				= this.fieldAddressActual.originalValue;
			record.reject();

			this.selectRecord(record);
		}
	},

	/**
	* Returns true if current tab data has changes
	* @return {Boolean}
	*/
	isDirty: function() {
		var form = this.getForm();
		return form ? form.isDirty() : false;
	}
});
