/**
 * @class O.dn.lib.analytics.tab.Settings
 */
C.utils.inherit('O.dn.lib.analytics.tab.Settings', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.on('afterrender', 'applyConfigValue', this, { delay: 1});
		Ext.iterate(this.grids, function(name, grid) {
			grid.on('selectionchange', 'checkDirty', this);
		}, this);
		var itemsCheckAll = this.query('component[action=check-all]');
		if (itemsCheckAll && itemsCheckAll.length) {
			Ext.each(itemsCheckAll, function(item) {
				item.setHandler(this.doCheckAll, this);
			}, this);
		}
		var searchFields = this.query('component[action=search]');
		if (searchFields && searchFields.length) {
			Ext.each(searchFields, function(field) {
				field.on({
					specialkey: 'onSearchFieldSpecialKey',
					keyup: 'search',
					scope: this
				});
			}, this)
		}
		var itemsCheckNone = this.query('component[action=check-none]');
		if (itemsCheckNone && itemsCheckNone.length) {
			Ext.each(itemsCheckNone, function(item) {
				item.setHandler(this.doCheckNone, this);
			}, this);
		}
		if (this.fieldPeriod_sdt) {
			this.fieldPeriod_sdt.on('change', 'checkDirty', this);
		}
		if (this.fieldPeriod_edt) {
			this.fieldPeriod_edt.on('change', 'checkDirty', this);
		}
	},

/**
	* Check all action
	* @param {Ext.Component} btn
	*/
	doCheckAll: function(btn) {
		var grid = this.grids[btn.link];
		if (grid) {
			var sm = grid.getSelectionModel();
			if (sm) {
				sm.selectAll(true);
			}
		}
	},

/**
	* Check all action
	*/
	doCheckNone: function(btn) {
		var grid = this.grids[btn.link];
		if (grid) {
			var sm = grid.getSelectionModel();
			if (sm) {
				sm.deselectAll(true);
			}
		}
	},

/**
	* Checks dirty state of current form
	* @return {Boolean}
	*/
	checkDirty: function() {
		var record = this.getSelectedRecord();
		if (!record) { return; }
		if (this.isLoading) { return; }
		var config = this.getFieldValue('config');
		var configInitial = record.get('config');
		if (record.modified && record.modified.config) {
			configInitial = record.modified.config;
		}
		if (!configInitial || configInitial === '') { configInitial = '{}'; }
		var isDirty = (config !== configInitial);
		if (isDirty !== this.dirty) {
			this.dirty = isDirty;
			this.fireEvent('dirtychange');
		}
	},

/**
	* Apply config value for grids in current panel
	* @param {String} value
	*/
	applyConfigValue: function(value) {
		var record = this.getSelectedRecord();
		if (!record || !this.rendered) { return; }
		if (!Ext.isString(value)) { value = null; }
		var value = value || record.get('config');
		var data = (value === '') ? {} : Ext.decode(value);
		this.isLoading = true;
		Ext.iterate(this.grids, function(name, grid) {
			var sm = grid.getSelectionModel();
			if (sm) {
				sm.deselectAll(true);
				var store = grid.getStore();
				var selected = data[name];
				if (selected && selected.length && store) {
					var records = [];
					store.each(function(r) {
						if (Ext.Array.contains(selected, r.getId())) {
							records.push(r);
						}
					});
					sm.select(records);
				}
			}
		}, this);
		// period value
		if (data.period_sdt && this.fieldPeriod_sdt) {
			this.fieldPeriod_sdt.setValue(data.period_sdt);
		}
		if (data.period_edt && this.fieldPeriod_edt) {
			this.fieldPeriod_edt.setValue(data.period_edt);
		}
		this.isLoading = false;
		this.checkDirty();
	},

/**
	* Loads data from record
	* @param {Ext.data.Model} record
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	*/
	selectRecord: function(record, noReset) {
		this.callParent(arguments);
		this.applyConfigValue();
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
		var values = {};
		if (!dirtyOnly || this.dirty) {
			values.config = this.getFieldValue('config');
		}
		return values;
	},

/**
	* Applies changes to tab fields
	* @param {Object} changes
	*/
	setFieldValues: function(changes) {
		this.callParent(arguments);
		Ext.iterate(changes, function(fieldName, fieldValue) {
			if (fieldName === 'config') {
				this.applyConfigValue(fieldValue);
			}
		}, this);
	},

/**
	* Search for field value by fieldName in current tab
	* @param {String} fieldName
	* @return {Object}
	*/
	getFieldValue: function(fieldName) {
		if (fieldName === 'config') {
			var result = {};
			Ext.iterate(this.grids, function(name, grid) {
				var sm = grid.getSelectionModel();
				if (sm) {
					var selected = sm.getSelection();
					if (selected && selected.length) {
						result[name] = [];
						Ext.each(selected, function(item) {
							result[name].push(item.getId());
						});
						result[name] = Ext.Array.sort(result[name]);
					}
				}
			}, this);
			// period value
			if (this.fieldPeriod_sdt) {
				var period_sdt = this.fieldPeriod_sdt.getSubmitValue();
				if (period_sdt) {
					result.period_sdt = period_sdt;
				}
			}
			if (this.fieldPeriod_edt) {
				var period_edt = this.fieldPeriod_edt.getSubmitValue();
				if (period_edt) {
					result.period_edt = period_edt;
				}
			}
			return Ext.encode(result);
		}
		return null;
	},

/**
	* Updates record with form data
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		if (!record) { return; }
		record.set('config', this.getFieldValue('config'));
	},

/**
	* Returns true if current tab data has changes
	* @return {Boolean}
	*/
	isDirty: function() {
		return this.dirty;
	},

/**
	* Resets form data
	*/
	reset: function() {
		var record = this.getSelectedRecord();
		if (record) {
			record.reject();
		}
		this.applyConfigValue();
	},

/**
	* Clears data
	*/
	clear: function() {
		this.applyConfigValue({});
	},

/**
	* Stores grid selection
	*/
	storeSelection: function(grid) {
		var sm = grid.getSelectionModel();
		if (!sm) { return; }
		var selection = sm.getSelection();
		if (!this.cachedSelection) {
			this.cachedSelection = selection;
		} else {
			grid.getStore().each(function(item) {
				if (sm.isSelected(item)) {
					if (Ext.Array.indexOf(this.cachedSelection, item) < 0) {
						this.cachedSelection.push(item);
					}
				} else {
					if (Ext.Array.indexOf(this.cachedSelection, item) >= 0) {
						Ext.Array.remove(this.cachedSelection, item);
					}
				}
			}, this);
		}
	},

/**
	* Restores grid selection
	*/
	restoreSelection: function(grid) {
		var sm = grid.getSelectionModel();
		if (!sm) { return; }
		if (this.cachedSelection) {
			sm.select(this.cachedSelection);
		}
	},

/**
	* Search field handler
	* @param {Ext.Component} field
	*/
	search: function(field) {
		var grid = this.grids[field.link];
		if (!grid) { return; }
		this.storeSelection(grid);
		var searchString = field.getValue();
		var regexp = null,
			pattern;
			pattern = Ext.String.escapeRegex(searchString)
				.replace(/\*/g, '.*')
				.replace(/%/g, '.*');
			var columnsCount = grid.columns.length;
		try
		{
			regexp = new RegExp(pattern, 'ig');
			var filter = new Ext.util.Filter({
				filterFn: function(item) {
					// i starts from 1, because the first column
					// of the grid is a selection checkbox
					for (var i = 1; i < columnsCount; i++) {
						var name = item.get(grid.columns[i].dataIndex) + '';
						if (name.match(regexp)) { return true; }
					}
					return false;
				}
			});
			grid.getStore().clearFilter();
			grid.getStore().filter(filter);
			this.restoreSelection(grid);
		}
		catch (e)
		{
			console.error('Error: Illegal regexp: ' + pattern);
			return;
		}
	},

/**
	* If user press 'Enter' we should search
	* @param {Ext.form.Field} field
	* @param {Ext.EventObject} e
	*/
	onSearchFieldSpecialKey: function(field, e) {
		if (e.getKey() == e.ENTER) {
			this.search(field.getValue());
		}
	}

});
