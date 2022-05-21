/**
 *
 * @class O.common.act.package.tab.Props
 * @extends C.ui.Panel
 */
C.utils.inherit('O.common.act.tariff.tab.Props', {

/**
	* @cfg {Boolean} is dirty
	*/
	dirty: false,

/**
	* @cfg {Ext.data.Store} packages store
	*/
	packages: false,

/**
	* @cfg {Number} selected id_package
	*/
	idPackage: false,

/**
	* @constructor
	*/
	initComponent: function() {
		this.packages = C.getStore('x_package');
		this.callOverridden(arguments);
		this.combo = this.down('combobox');
		this.identifier = this.down('#identifier');
		this.individual = this.down('#individual');
		this.freeDays = this.down('#free_days');
		this.limitValue = this.down('#limit_value');
	},

/**
	* Loads data from record
	* @param {Ext.data.Model} record
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	*/
	selectRecord: function(record, noReset) {
		this.selectingRecord = true;
		this.callParent(arguments);
		this.selectingRecord = false;

		this.dirty = false;
		this.populateGrids();
	},

/**
	* Loads data into grids
	*/
	populateGrids: function() {
		var record = this.getSelectedRecord();

		if (!record) {
			return;
		}

		var fees = record.get('fee'),
			options = record.get('tariff_option'),
			modules = record.get('modules'),
			feeStore = this.grids.fee.getStore(),
			optionStore = this.grids.tariff_option.getStore(),
			moduleStore = this.grids.modules.getStore();

		moduleStore.each(function(record){
			record.set('enabled', Ext.Array.contains(modules, record.getId()));
			record.commit();
		});

		optionStore.each(function(record){
			var id = record.getId(), value = 0;
			Ext.Array.each(options, function(option){
				if (option.id_tariff_option == id) {
					value = option.value;
					return false;
				}
			});
			record.set('value', value);
			record.commit();
		});

		feeStore.each(function(record){
			var id = record.getId(),
				amount = null,
				noFeeCount = 0,
				isMonthly = 0;
			Ext.Array.each(fees, function(fee){
				if (fee.id_fee == id) {
					amount = fee.amount;
					noFeeCount = fee.no_fee_count;
					isMonthly = fee.is_monthly;
					return false;
				}
			});
			record.set('amount', amount);
			record.set('no_fee_count', noFeeCount);
			record.set('is_monthly', isMonthly);
			record.commit();
		});
	},

/**
	* Retrieves the fields in the form as a set of key/value pairs, using
	* their {@link Ext.form.field.Field#getModelData getModelData()} method
	* to collect the values. If multiple fields return values under the same
	* name those values will be combined into an Array.
	* This is similar to {@link #getValues} except that this method collects
	* type-specific data values (e.g. Date objects for date fields) while
	* getValues returns only String values for submission.
	* @param {Boolean} dirtyOnly (optional) If true, only fields that are
	*     dirty will be included in the result. Defaults to false.
	* @return {Object}
	*/
	getFieldValues: function(dirtyOnly) {
		var vls = this.callParent(arguments);
		if (!this.getSelectedRecord()) {
			if (dirtyOnly) {
				return {};
			} else {
				return {
					fee: [],
					modules: [],
					tariff_option: []
				};
			}
		}

		// TODO: Looks like very bad code
		var values = {
			fee: this.getFieldValue('fee'),
			modules: this.getFieldValue('modules'),
			tariff_option: this.getFieldValue('tariff_option'),
			id_package: this.combo.getValue(),
			identifier: this.identifier.getValue(),
			individual: +this.individual.getValue(),
			free_days: this.freeDays.getValue(),
			limitvalue: this.limitValue.getValue()
		};

		if (dirtyOnly) {
			Ext.Object.each(values, function(key, value){
				var recordValue = this.getSelectedRecord().get(key);

				if (typeof recordValue != 'object' && typeof value != 'object') {

					if (recordValue == value) {
						delete values[key];
					}

				} else {

					var tmpValue = [],
						tmpRecordValue = [];
					if (value[0] && typeof value[0] == 'object') {
						Ext.each(value, function(item){
							tmpValue.push(item.id_tariff_option + '-' +
								item.id_fee + '-' + item.value + '-'
								+ +item.amount + '-' + item.no_fee_count
								+ '-' + item.is_monthly);
						});
						Ext.each(recordValue, function(item){
							tmpRecordValue.push(item.id_tariff_option + '-' +
								item.id_fee + '-' + item.value + '-'
								+ +item.amount + '-' + item.no_fee_count
								+ '-' + item.is_monthly);
						});
					} else {
						tmpValue = value;
						tmpRecordValue = recordValue;
					}

					if (Ext.isEmpty(Ext.Array.difference(tmpValue, tmpRecordValue)) &&
						Ext.isEmpty(Ext.Array.difference(tmpRecordValue, tmpValue))) {

						delete values[key];
					}
				}
			}, this);
		}

		return values;
	},

/**
	* Search for field value by fieldName in current tab
	* @param {String} fieldName
	* @return {Object}
	*/
	getFieldValue: function(fieldName) {
		if (fieldName == 'fee') {
			return this.getFeeValue();
		}
		if (fieldName == 'tariff_option') {
			return this.getOptionValue();
		}
		if (fieldName == 'modules') {
			return this.getModuleValue();
		}

		return this.callParent(arguments);
	},

/**
	* Returns compiled value of fee grid
	* @return {Object}
	*/
	getFeeValue: function() {
		var value = [];
		this.grids.fee.getStore().each(function(record) {
			value.push({
				id_fee: record.get('id') || 0,
				amount: record.get('amount') || 0,
				no_fee_count: record.get('no_fee_count') || 0,
				is_monthly: record.get('is_monthly') || 0
			});
		});
		return value;
	},

/**
	* Returns compiled value of tariff options grid
	* @return {Object}
	*/
	getOptionValue: function() {
		var value = [];
		this.grids.tariff_option.getStore().each(function(record) {
			value.push({
				id_tariff_option: record.get('id') || 0,
				value: record.get('value') || 0
			});
		});
		return value;
	},

/**
	* Returns compiled value of modules grid
	* @return {Object}
	*/
	getModuleValue: function() {
		var value = [];
		this.grids.modules.getStore().each(function(record) {
			if (record.get('enabled')) {
				value.push(record.get('id'));
			}
		});
		return value;
	},

/**
	* Updates record with form data
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		if (!record) { return; }
		var values = this.getFieldValues(true);
		Ext.Object.each(values, function(key, value){
			record.set(key, value);
		}, this);
	},

/**
	* Returns true if current tab data has changes
	* @return {Boolean}
	*/
	isDirty: function() {
		var form = this.getForm();
		return this.dirty || form.isDirty();
	},

/**
	* Returns true if current tab data is valid
	* @return {Boolean}
	*/
	isValid: function() {
		return true;
	},

/**
	* Resets form data
	*/
	reset: function() {
		this.callParent(arguments);
		this.populateGrids();
		this.onValueChange();
	},

/**
	* Clears data
	*/
	clear: function() {
		this.callParent(arguments);

		var feeStore = this.grids.fee.getStore(),
			optionStore = this.grids.tariff_option.getStore(),
			moduleStore = this.grids.modules.getStore();

		moduleStore.each(function(record) {
			record.set('enabled', false);
			record.commit();
		});

		optionStore.each(function(record) {
			record.set('value', null);
			record.commit();
		});

		feeStore.each(function(record) {
			record.set('amount', null);
			record.set('no_fee_count', null);
			record.set('is_monthly', null);
			record.commit();
		});

		this.onValueChange();
	},

/**
	 * Обработчик редактирования колонок
	 */
	onValueEdit: function(editor, event) {
		event.record.set(event.newValues);
		this.onValueChange();
	},

/**
	 * Обработчик редактирования колонок
	 */
	onValueChange: function() {
		var dirty = !C.utils.isEmptyObject(this.getFieldValues(true));

		if (dirty != this.dirty) {
			this.dirty = dirty;
			this.fireEvent('dirtychange');
		}
	},

	/**
	 * Обработчик смены выбранного пакета
	 */
	onPackageSelect: function(box, value) {
		if (value == this.idPackage) {
			return;
		}

		this.idPackage = value;

		if (value) {
			var package = this.packages.getById(value);
		}

		Ext.Object.each(this.grids, function(key, grid) {
			var store = grid.getStore();
			store.clearFilter(true);
			if (package) {
				store.filterBy(function(record, id){
					return Ext.Array.contains(package.get(key), record.getId());
				});
			}
		});

		if (!this.selectingRecord) {
			this.onValueChange();
		}
	}
});
