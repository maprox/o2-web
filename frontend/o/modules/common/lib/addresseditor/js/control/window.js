/**
 *
 * Window for editing address
 * @class O.lib.window.AddressEditor
 * @extends Ext.window.Window
 */
C.utils.inherit('O.lib.window.AddressEditor', {
/**
	*
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.citySelect) {
			this.citySelect.on('change', 'onCitySelect', this);
			this.citySelect.on('blur', 'onCitySelectBlur', this);
		}
		this.items.each(function(field) {
			field.on('change', 'validateAddress', this);
		}, this);
		if (this.saveButton) {
			this.saveButton.setHandler(this.saveAddress, this);
		}
		if (this.cancelButton) {
			this.cancelButton.setHandler(this.destroy, this);
		}
		if (this.countrySelect) {
			this.countrySelect.on('change', 'onCountrySelect', this);
			this.countrySelect.store.on({
				load: function() {
					if (this.createData === undefined) {
						this.getCreateData();
					} else {
						this.setCreateData(this.createData);
					}
				},
				scope: this
			});
		}
		this.show();
	},

/**
	* Gathers data, fires 'saved' event, genuflects
	*/
	saveAddress: function() {
		var me = this;
		me.setLoading(true);
		// Gather form data
		var data = {};

		this.items.each(function(item) {
			var value = item.getValue();
			if (item.is('combobox') && typeof value == "number") {
				// Save id
				data['id_' + item.getName()] = value;
				//Save raw value
				data[item.getName()] =
						item.getRawValue();
			} else {
				data[item.getName()] = value;
			}
		});

		// If there is no id_city then create new city
		if (data['id_city'] == undefined) {
			// Street object
			var city = {
				name: data.city,
				id_lang: 2, // Allways russian
				id_country: data.id_country
			};

			// Saving new street
			Ext.Ajax.request({
				url: '/a_city',
				method: 'post',
				params: city,
				scope: this,
				success: function(response) {
					var response = Ext.decode(response.responseText);
					// Create new address
					data.id_city = response.data.id_city;
					this.createStreet(data);
				}
			});
		} else {
			this.createStreet(data);
		}
	},

/**
	* Creates new street and pass data to createAddress
	*/
	createStreet: function(data) {
		// If there is no id_street then create new street
		if (data['id_street'] == undefined) {

			// Street object
			var street = {
				name: data.street,
				id_lang: 2, // Allways russian
				id_city: data.id_city
			};

			// Saving new street
			Ext.Ajax.request({
				url: '/a_street',
				method: 'post',
				params: street,
				scope: this,
				success: function(response) {
					var response = Ext.decode(response.responseText);
					// Create new address
					data.id_street = response.data.id_street;
					this.createAddress(data);
				}
			});
		} else {
			// Create new address
			this.createAddress(data);
		}
	},

/**
	* Create new address
	*/
	createAddress: function(data) {
		var me = this;
		//me.setLoading(true);
		// Allways russian
		data.id_lang = 2;

		// Set full and short name
		data.fullname = this.buildFullAddress(data);
		data.shortname = this.buildShortAddress(data);

		// Save some fields
		var id_city = data['id_city'];
		var id_country = data['id_country'];

		// Unset unnecessary fields before saving
		delete data['city'];
		delete data['country'];
		delete data['street'];
		delete data['id_city'];
		delete data['id_country'];

		// Saving address as a new a_address table entry
		Ext.Ajax.request({
			url: '/a_address',
			method: 'post',
			params: data,
			scope: this,
			success: function(response) {
				var response = Ext.decode(response.responseText);

				this.setCreateData(data);

				var result = response.data;
				result.id_city = id_city;
				result.id_country = id_country;

				this.fireEvent('saved', result);

				// Destroy window
				this.destroy();
				me.setLoading(false);
			}
		});
	},

/**
	* Checks for all required fields to be non-empty
	*/
	validateAddress: function() {
		var valid = true;

		this.items.each(function(field){
			var errors = field.getErrors(field.getValue());
			if (errors.length) {
				valid = false;
			}
		});

		if (valid) {
			this.saveButton.enable();
		} else {
			this.saveButton.disable();
		}
	},

/**
	* Build full address
	*/
	buildFullAddress: function(data) {
		if (data.street.match(/[\.,]/i)) {
			var street = Ext.String.decapitalize(data.street);
		} else {
			street = data.street;
		}

		var address = data.index + ', ' +
			data.city + ', ' +
			street + ', ' +
			'д. ' + data.house;

		if (data.flat) {
			if (!data.flat.match(/^[\s\d]+$/i)) {
				var flat = Ext.String.decapitalize(data.flat);
			} else {
				flat = 'кв. ' + data.flat;
			}

			address = address + ', ' + flat;
		}

		if (data.floor) {
			address = address + ', эт. ' + data.floor;
		}

		return address;
	},

/**
	 * Bulds short address
	 */
	buildShortAddress: function(data) {
		return this.buildFullAddress(data);
	},

/**
	* Loads or unloads cities according to country selected
	* @param {Object} combobox - unneeded
	* @param {Mixed} value - combobox current value
	*/
	onCountrySelect: function(combobox, value) {

		this.changeOnSelect(this.citySelect, value);
	},

/**
	* Loads or unloads streets according to city selected
	* @param {Object} combobox - unneeded
	* @param {Mixed} value - combobox current value
	*/
	onCitySelect: function(combobox, value) {

		this.changeOnSelect(this.streetSelect, value);
	},

/**
	* On city combobox focus lose
	*/
	onCitySelectBlur: function(combobox) {
		var record = combobox.store.getAt(0);
		var value = combobox.getValue();
		if (record) {
			var name = record.get('name');
			if (name
				&& value
				&& name !== value
				&& name.length == value.length
			) {
				combobox.select(record);
			}
		}
	},

/**
	* Loads or unloads data, according to selection
	* @param {Object} childSelect - combobox to load into
	* @param {Mixed} value - current selection value
	*/
	changeOnSelect: function(childSelect, value, setValue) {
		childSelect.reset();

		if (value == null) {

			childSelect.store.removeAll();
		} else if (typeof value == "number") {
			// If id choised
			// Get child select store
			var store = childSelect.store;

			// Street
			if (childSelect.name == 'street') {

				childSelect.setLoading(true);

				// Allways russian
				var filter = 'id_city eq ' + value + ' AND ' + 'id_lang eq 2';

				C.get('a_street', function(list, success, data) {
					if (!success) {
						childSelect.setLoading(false);
						return;
					}
					this.streetStore.loadData(data.data);

					childSelect.suspendEvents(false);
					// Set selected value
					if (typeof setValue == "string") {
						childSelect.setRawValue(setValue);
					} else {
						childSelect.setValue(setValue);
					}
					childSelect.resumeEvents();
					childSelect.setLoading(false);
				}, this, {
					'$filter': filter
				});
			}

			// City
			if (childSelect.name == 'city') {
				childSelect.setLoading(true);
				// Allways russian
				var filter = 'id_country eq ' + value +
					' AND ' + 'id_lang eq 2';

				C.get('a_city', function(list, success, data) {
					if (!success) {
						childSelect.setLoading(false);
						return;
					}
					this.cityStore.loadData(data.data);

					childSelect.suspendEvents(false);
					// Set selected value
					if (typeof setValue == "string") {
						childSelect.setRawValue(setValue);
					} else {
						childSelect.setValue(setValue);
					}
					childSelect.resumeEvents();
					childSelect.setLoading(false);
				}, this, {
					'$filter': filter
				});
			}

			// Country
			if (childSelect.name == 'country') {
				store.getProxy().extraParams = {
					parentId: value
				};

				childSelect.setLoading(true);

				store.load(function(records, operation, success) {
					if (setValue != undefined) {
						childSelect.suspendEvents(false);

						if (typeof setValue == "string") {
							childSelect.setRawValue(setValue);
						} else {
							childSelect.setValue(setValue);
						}
						childSelect.resumeEvents();
					}

					childSelect.setLoading(false);
				});
			}
		}
	},

/**
	* Requests address data by address_id
	*/
	getCreateData: function() {

		// Address not exists
		if(!this.addressId) return;

		this.setLoading(true);

		Ext.Ajax.request({
			url: '/a_address',
			method: 'get',
			params: {id: this.addressId},
			scope: this,
			success: function(response) {
				var response = Ext.decode(response.responseText),
					data = response.data;

				this.setCreateData(data);

				this.setLoading(false);
			}
		});
	},

	setCreateData: function(data) {
		this.countrySelect.suspendEvents(false);
		this.countrySelect.setValue(data.id_country);
		this.countrySelect.resumeEvents();

		this.changeOnSelect(this.citySelect, data.id_country, data.id_city);

		if (data.id_street) {
			this.changeOnSelect(this.streetSelect, data.id_city, data.id_street);
		} else {
			this.changeOnSelect(this.streetSelect, data.id_city, data.street);
		}

		this.houseField.setValue(data.house);
		this.flatField.setValue(data.flat);
		this.floorField.setValue(data.floor);
		this.indexField.setValue(data.index);
	}
});
