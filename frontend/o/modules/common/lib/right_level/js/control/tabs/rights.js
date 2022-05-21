/**
 * @class O.common.lib.right_level.tab.Rights
 */
C.utils.inherit('O.common.lib.right_level.tab.Rights', {
/**
	* @constructs
	*/
	initComponent: function() {
		this.callParent(arguments);
		this.on('recordload', 'onRecordLoad', this);
		if (this.gridIncluded) {
			this.gridIncluded.getView().on('drop', 'checkDirty', this);
		}
		if (this.gridAvailable) {
			this.gridAvailable.getView().on('drop', 'checkDirty', this);
		}
		// x_right update
		O.manager.Model.getCurator('x_right').addListener(
			'update', this.onRecordLoad, this);
	},

/**
	* Handles record loading
	* @param {Ext.Component} tab
	* @param {Ext.data.Model} record
	* @private
	*/
	onRecordLoad: function() {
		this.reloadGrid();
	},

/**
	* Reload right grids
	* @param {Number[]} rights [opt.] An array of rights identifiers
	*/
	reloadGrid: function(rights) {
		var record = this.getSelectedRecord();
		if (!record) { return; }
		var gsa = [];
		var gsi = [];
		var includedIds = (rights) ? rights : record.get('rights');
		this.setLoading(true);
		C.get('x_right', function(rows) {
			rows.each(function(row) {
				if (Ext.Array.indexOf(includedIds, row.id) == -1) {
					gsa.push(row);
				} else {
					gsi.push(row);
				}
			}, this);
			this.gridAvailable.getStore().loadData(gsa);
			this.gridIncluded.getStore().loadData(gsi);
			this.checkDirty();
			this.setLoading(false);
		}, this);
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
			values.rights = this.getFieldValue('rights');
		}
		return values;
	},

/**
	* Search for field value by fieldName in current tab
	* @param {String} fieldName
	* @return {Object}
	*/
	getFieldValue: function(fieldName) {
		if (fieldName === 'rights') {
			var list = [];
			this.gridIncluded.getStore().each(function(record) {
				list.push(record.getId());
			});
			return list;
		}
		return null;
	},

/**
	* Checks dirty state of current form
	* @return {Boolean}
	*/
	checkDirty: function() {
		var record = this.getSelectedRecord();
		if (!record) { return; }
		var included = this.getFieldValue('rights');
		var list = record.get('rights');
		if (record.modified && record.modified.rights) {
			list = record.modified.rights;
		}
		var isDirty = !included.equals(list, true);
		if (isDirty !== this.dirty) {
			this.dirty = isDirty;
			this.fireEvent('dirtychange');
		}
	},

/**
	* Updates record with form data
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		if (!record) { return; }
		record.set('rights', this.getFieldValue('rights'));
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
		this.reloadGrid();
	},

/**
	* Clears data
	*/
	clear: function() {
		this.reloadGrid([]);
	}

});
