/**
 *
 * @class O.common.act.package.tab.Props
 * @extends C.ui.Panel
 */
C.utils.inherit('O.common.act.package.tab.Props', {

/**
	* @cfg {Boolean} is dirty
	*/
	dirty: false,

/**
	* Loads data from record
	* @param {Ext.data.Model} record
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	*/
	selectRecord: function(record, noReset) {
		this.selectedRecord = record;
		this.displaySelectedRecord();

		this.dirty = false;
		this.fireEvent('recordload', this, record, noReset);
	},

/**
	* Loads data from selected record into grids
	*/
	displaySelectedRecord: function() {
		var record = this.getSelectedRecord();
		this.loadGrid(this.grids.fee, record.get('fee'));
		this.loadGrid(this.grids.right_level, record.get('right_level'));
		this.loadGrid(this.grids.module, record.get('modules'));
		this.loadGrid(this.grids.tariff_option, record.get('tariff_option'));
	},

/**
	* Loads data into grid
	* @param {Ext.grid.Panel} grid
	* @param {Number[]} ids selected ids
	*/
	loadGrid: function(grid, ids) {
		var store = grid.getStore();
		var records = store.getRange();
		Ext.each(records, function(record) {
			record.set('enabled', Ext.Array.indexOf(ids, record.get('id')) > -1);
			record.commit();
		});
		store.loadData(records);
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
		if (!this.getSelectedRecord()) {
			if (dirtyOnly) {
				return {};
			} else {
				return {
					fee: [],
					right_level: [],
					modules: [],
					tariff_option: []
				};
			}
		}

		var values = {
			fee: this.getFieldValue('fee'),
			right_level: this.getFieldValue('right_level'),
			modules: this.getFieldValue('module'),
			tariff_option: this.getFieldValue('tariff_option')
		};

		if (dirtyOnly) {
			Ext.Object.each(values, function(key, value){
				var recordValue = this.getSelectedRecord().get(key);

				if (Ext.isEmpty(Ext.Array.difference(recordValue, value)) &&
					Ext.isEmpty(Ext.Array.difference(value, recordValue))) {

					delete values[key];
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
		if (!this.grids[fieldName]) {
			return undefined;
		}
		var fieldValue = [];
		var records = this.grids[fieldName].getStore().getRange();
		Ext.each(records, function(record) {
			if (record.get('enabled')) {
				fieldValue.push(record.get('id'));
			}
		});
		return fieldValue;
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
		return this.dirty;
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
		this.displaySelectedRecord();

		this.onCheckChange();
	},

/**
	* Clears data
	*/
	clear: function() {
		this.loadGrid(this.grids.fee, []);
		this.loadGrid(this.grids.right_level, []);
		this.loadGrid(this.grids.module, []);
		this.loadGrid(this.grids.tariff_option, []);

		this.onCheckChange();
	},

	/**
	 * Обработчик редактирования колонок
	 */
	onCheckChange: function() {
		var dirty = !C.utils.isEmptyObject(this.getFieldValues(true));

		if (dirty != this.dirty) {
			this.dirty = dirty;
			this.fireEvent('dirtychange');
		}
	}
});
