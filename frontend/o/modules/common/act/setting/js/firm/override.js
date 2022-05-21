/**
 * @fileOverview Класс панели настроек. Настройки фирмы.
 */

/**
 * Класс панели настроек предприятия<br/>
 * @author <a href="mailto:sunsay@maprox.net">Ляпко Александр</a>
 *
 * @class O.comp.settings.firm.Base
 * @extends O.comp.SettingsPanel
 */
C.utils.inherit('O.comp.settings.firm.Base', {

/**
	* Id of setting action for non-standart values
	* @protected {String}
	*/
	idSetting: 'address',

/**
	* Stores changes to address fields
	* @protected {String}
	*/
	address: {},

/**
	* Processess child form 'addresschanged' event,
	* fires 'clientvalidation' event
	* @param {Object} changed - data of 'addresschanged' event
	*/
	onAddressChanged: function(changed) {
		// Remove prefix
		changed.name = changed.name.replace(/^[a-z]+\./i, '');

		// Save address changes
		this.address[changed.name] = changed.data.id_address;
		//this.fireEvent('clientvalidation', this.getValidateForm());
	},

/**
	* Fill in the form panel fields
	* @protected
	*/
	applyData: function() {
		this.getSettings(function(s, success) {
			this.unlock();
			if (!success) { return; }

			var r = s.getRange();
			this.getForm().setValues(r);

			// Set address legal id
			if(s.get('f.addresslegal_id')) {
				this.panelRequisites.setLegalAddressId(
					s.get('f.addresslegal_id').value
				);
			}
			// Set address actual id
			if(s.get('f.addressactual_id')) {

				this.panelRequisites.setActualAddressId(
					s.get('f.addressactual_id').value
				);
			}
			// Trigger set start values
			this.panelRequisites.setStartValues(s);

			this.isLoaded = true;
		}, this);

		this.address = {};
	},

/**
	* Gathers changes that user have made in settings
	* @return {Object}
	*/
	getChangedData: function() {
		var result = [];

		// Save legal address
		if(this.address['addresslegal']) {
			result.push({
				id: 'f.addresslegal',
				value: this.address['addresslegal']
			});
		}

		// Save actual address
		if(this.address['addressactual']) {
			result.push({
				id: 'f.addressactual',
				value: this.address['addressactual']
			});
		}

		this.getSettings(function(s, success) {

			s.each(function(item) {
				var f = this.getForm().findField(item.id);
				if (f) {
					if (f.isDirty() && !f.readOnly) {
						var value = f.getValue();

						if (item.type == "int") {
							value = value - 0;
						}

						result.push({
							id: f.getName(),
							value: value
						});
					}
				}
			}, this)
		}, this);

		return result;
	},

/**
	* Unsets all changes, user have made since last 'save' action
	*/
	setDefaultData: function() {
		this.getForm().reset();
		this.applyData();
		/*Ext.each(this.address, function(address) {
			this.panelRequisites
				.resetAddressValue(address.name, address.oldData);
		}, this);*/

		this.address = {};
	},

/**
	* Have changes
	* @return {Boolean}
	*/
	haveDirty: function() {
		return this.getForm().isDirty() || this.address.length > 0;
	},

/**
	* Fetches form for validation
	* @return {Ext.form.Basic}
	*/
	getValidateForm: function() {
		return this;
	},

	getFields: function() {
		return this.getForm().getFields();
	}
});
