/**
 * @class O.lib.panel.CompanyRequisites
 */

C.utils.inherit('O.lib.panel.CompanyRequisites', {

	initComponent: function() {
		this.callOverridden(arguments);
		this.on('afterrender', this.onAfterRender, this);
	},

	legalAddressId: null,
	actualAddressId: null,

	savedAddresses: {},
/**
	* Set actual address the same checkbox
	*/
	setStartValues: function() {
		if (this.legalAddressId) {
			if ((this.legalAddressId == this.actualAddressId) ||
				(this.fieldAddressLegal.getValue() ==
				this.fieldAddressActual.getValue())
			) {
				this.checkboxAddress.originalValue = true;
				this.checkboxAddress.setValue(true);
			} else {
				this.checkboxAddress.originalValue = false;
				this.checkboxAddress.setValue(false);
			}
		}
	},

/**
	* Set legal address id
	*/
	setLegalAddressId: function(id) {
		this.legalAddressId = id;
	},

/**
	* Set actual address id
	*/
	setActualAddressId: function(id) {
		this.actualAddressId = id;
	},

/**
	* Запускает редактирование юридического адреса
	*/
	editLegalAddress: function() {
		this.initAddressForm(this.fieldAddressLegal);
	},

/**
	* Запускает редактирование актуального адреса
	*/
	editActualAddress: function() {
		this.initAddressForm(this.fieldAddressActual);
	},

/**
	* Создает окно для ввода адреса
	* @param Object field Объект поля, куда записать результат
	*/
	initAddressForm: function(field) {
		var name = field.getName();
		// Уберем префикс
		name = name.replace(/^[a-z]+\./i, '');

		var addressId = null;
		if (name == 'addresslegal') {
			addressId = this.legalAddressId;
		}

		if (name == 'addressactual') {
			addressId = this.actualAddressId;
		}

		// Create window
		var window = Ext.create('O.lib.window.AddressEditor', {
			fieldName: name,
			addressId: addressId
		});

		// When new address has been created
		window.on('saved', function(data) {

			// Set new address ids
			if(name == 'addresslegal') {
				this.setLegalAddressId(data['id_address']);
			}

			if(name == 'addressactual') {
				this.setActualAddressId(data['id_address']);
			}

			// Fire event for using in parent component
			this.fireEvent('addresschanged', {
				name: name,
				data: data,
				oldData: field.getValue()
			});

			// Set field value
			field.setValue(data.fullname);

			// If the same checkbox
			if (this.checkboxAddress.getValue() && name == "addresslegal") {
				this.setSameActualAddressAsLegal();
			}

		}, this);
	},

/**
	* Устанвливает значение адреса в указанное поле
	* Вызывается родительским элементом, например при сбросе данных
	* @param String name Имя поля
	* @param String value Значение адреса
	*/
	resetAddressValue: function(name, value) {
		var field = this.down('field[name=f.'+name+']');

		if (typeof field == "object") {
			field.setValue(value);
		}
	},

/**
	* The same actual address checkbox handler
	*/
	sameAddressChecked: function(field, checked) {
		if (checked) {
			this.actualButton.disable();

			if (this.fieldAddressLegal.getValue() !=
				this.fieldAddressActual.getValue()) {

				this.setSameActualAddressAsLegal();
			} else {
				this.checkboxAddress.originalValue = true;
				this.checkboxAddress.setValue(true);
			}

		} else {
			this.checkboxAddress.originalValue = false;
			this.checkboxAddress.setValue(false);
			this.actualButton.enable();
		}
	},

/**
	* Set actual address value the same as legal
	*/
	setSameActualAddressAsLegal: function() {
		if(this.legalAddressId) {
			var fullname = this.fieldAddressLegal.getValue();

			this.fireEvent('addresschanged', {
				name: "addressactual",
				data: {
					id_address: this.legalAddressId
				},
				oldData: this.fieldAddressActual.getValue()
			});

			// Set new field value
			this.fieldAddressActual.setValue(fullname);
		}
	},

/**
	* After render handler
	* @private
	*/
	onAfterRender: function() {
		if (this.readonly && this.showFillInLinks) {
			this.doShowFillInLinks();
		}
	},

/**
	* TODO COMMENT THIS!
	*/
	doShowFillInLinks: function() {
		var queryString = 'companyrequisites[uniqueId="' +
			this.uniqueId + '"] displayfield'
		var fields = Ext.ComponentQuery.query(queryString),
			value = '<a class="must_feel" href="/admin#settings/firm" target="_blank">'
				+ this.lngRequired + '</a>';
		for (var i = 0, l = fields.length; i < l; i++) {
			var f = fields[i];
			if (!f.getValue() && !f.allowBlank) {
				f.setValue(value);
			}
		}
	}
});
