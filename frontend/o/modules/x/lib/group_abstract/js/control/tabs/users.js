/**
 * @class O.x.lib.group_abstract.tab.Users
 * @extends O.common.lib.modelslist.Tab
 */
C.utils.inherit('O.x.lib.group_abstract.tab.Users', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.dirty = false;

		this.callParent(arguments);
		this.checkcolumn.on('checkchange', this.onValueChange ,this);
	},

/**
	* Loads data into grids
	* @param {Boolean} reset (optional) Load original values
	*/
	populateGrids: function(reset) {
		var record = this.getSelectedRecord();

		if (!record) {
			return;
		}

		var user = [];

		if (reset) {
			user = record.getAccessIds('user');
		} else {
			if (this.isDirty()) {
				user = record.get('user');
				if (!user) {
					user = [];
				}
			} else {
				user = record.getAccessIds('user');
			}
		}

		var userStore = this.grids.user.getStore();

		userStore.each(function(record) {
			record.set('enabled', Ext.Array.contains(user, record.getId()));
			record.commit();
		});
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

		if (!noReset) {
			this.dirty = false;
		}
		this.populateGrids();
	},

/**
	 * Обработчик редактирования колонок
	 */
	onValueEdit: function(editor, event) {
		event.record.set(event.newValues);
		this.onValueChange();
	},

/**
	 * Value change gandler
	 */
	onValueChange: function() {
		var dirty = !C.utils.isEmptyObject(this.getFieldValues(true));

		if (dirty != this.dirty) {
			this.dirty = dirty;
		}
		this.fireEvent('dirtychange');
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
					user: []
				};
			}
		}

		var values = {
			user: this.getFieldValue('user')
		};

		if (dirtyOnly) {
			Ext.Object.each(values, function(key, value) {
				var recordValue = this.getSelectedRecord().getAccessIds(key);

				if (typeof recordValue != 'object' && typeof value != 'object') {
					if (recordValue == value) {
						delete values[key];
					}

				} else {
					if (value[0] && typeof value[0] == 'object') {
						var tmpValue = [];
						var tmpRecordValue = [];
						Ext.each(value, function(item) {
							tmpValue.push(item.id);
						});
						Ext.each(recordValue, function(item){
							tmpRecordValue.push(item.id);
						});
					} else {
						var tmpValue = value;
						var tmpRecordValue = recordValue;
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
		if (fieldName == 'user') {
			return this.getUserValue();
		}

		return this.callParent(arguments);
	},

/**
	* Returns compiled value of user grid
	* @return {Object}
	*/
	getUserValue: function() {
		var value = [];
		this.grids.user.getStore().each(function(record) {
			if (record.get('enabled')) {
				value.push(record.get('id'));
			}
		});
		return value;
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
		this.callParent(arguments);
		var record = this.getSelectedRecord();
		record.data.user = [];
		this.populateGrids(true);

		this.onValueChange();
	},

	/**
	* Updates record with form data
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		if (!record) { return; }
		var values = this.getFieldValues(false);

		var before = [];
		Ext.Array.each(record.get('$accesslist'), function(access) {
			before.push(access.id_user)
		});
		var after = values.user;

		var removed = Ext.Array.difference(before, after);
		var added = Ext.Array.difference(after, before);

		var accessGroupRevoke = [];
		Ext.Array.each(removed, function(id, index) {
			accessGroupRevoke.push({'id_user': id})
		});

		var accessGroupGrant = [];
		Ext.Array.each(added, function(id, index) {
			accessGroupGrant.push({'id_user': id})
		});

		record.set('$accessGroupRevoke', accessGroupRevoke);
		record.set('$accessGroupGrant', accessGroupGrant);
	}
});