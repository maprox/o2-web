/**
 * @class O.x.act.group_abstract.tab.Props
 */
C.utils.inherit('O.x.lib.group_abstract.tab.Props', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.on('recordload', this.onRecordLoad, this);

		this.searchIncluded = this.down('#includedSearch');
		this.searchAvailable = this.down('#availableSearch');

		if (this.gridIncluded) {
			this.gridIncluded.getView().on('drop', 'checkDirty', this);
			this.gridIncluded.getView().on('drop', 'onGridDrop', this);
		}
		if (this.gridAvailable) {
			this.gridAvailable.getView().on('drop', 'checkDirty', this);
			this.gridAvailable.getView().on('drop', 'onGridDrop', this);
		}

		if (this.searchIncluded) {
			this.searchIncluded.on({
				specialkey: 'onSearchFieldSpecialKey',
				keyup: 'search',
				scope: this
			});
		}

		if (this.searchAvailable) {
			this.searchAvailable.on({
				specialkey: 'onSearchFieldSpecialKey',
				keyup: 'search',
				scope: this
			});
		}

		// On entity update
		O.manager.Model.getCurator(this.entityAlias).addListener(
			'update', this.onUpdateEntity, this);

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
	},

/**
	* On grid drop
	*/
	onGridDrop: function() {
		this.search(this.searchIncluded);
		this.search(this.searchAvailable);
	},

/**
	* Search field handler
	* @param {Ext.Component} field
	*/
	search: function(field) {
		var grid = null;
		if (field.itemId == 'includedSearch') {
			grid = this.gridIncluded
		}

		if (field.itemId == 'availableSearch') {
			grid = this.gridAvailable
		}

		if (!grid) { return; }

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
					for (var i = 0; i < columnsCount; i++) {
						var name = item.get(grid.columns[i].dataIndex) + '';
						if (name.match(regexp)) { return true; }
					}
					return false;
				}
			});
			grid.getStore().clearFilter();
			grid.getStore().filter(filter);
		}
		catch (e)
		{
			console.error('Error: Illegal regexp: ' + pattern);
			return;
		}
	},

/**
	* Record loading handler
	*/
	onRecordLoad: function(cmp, record) {
		this.reloadGrid();
	},

/**
	 * On update entity
	 */
	onUpdateEntity: function() {
		var items = [];
		this.gridIncluded.getStore().clearFilter(true);
		this.gridIncluded.getStore().each(function(record) {
			items.push(record.get('id'));
		});
		this.search(this.searchIncluded);
		this.reloadGrid(items, false);
	},

/**
	* Reload entity grids
	* @param {Number[]} rights [opt.] An array of entity identifiers
	*/
	reloadGrid: function(items, checkDirty) {
		if (checkDirty === undefined) {
			checkDirty = true;
		}
		var record = this.getSelectedRecord();
		if (!record) { return; }
		var gsa = [], gsi = [];
		var includedIds = (items) ? items : record.get('items');
		this.setLoading(true);
		C.get(this.entityAlias, function(rows) {
			rows.each(function(row) {
				if (Ext.Array.indexOf(includedIds, row.id) < 0) {
					gsa.push(row);
				} else {
					gsi.push(row);
				}
			}, this);
			this.gridAvailable.getStore().loadData(gsa);
			this.gridIncluded.getStore().loadData(gsi);
			if (checkDirty) {
				this.checkDirty();
			}
			this.setLoading(false);
			this.gridIncluded.getStore().sort('name', 'ASC');
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
			values.items = this.getFieldValue('items');
		}
		return values;
	},

/**
	* Search for field value by fieldName in current tab
	* @param {String} fieldName
	* @return {Object}
	*/
	getFieldValue: function(fieldName) {
		if (fieldName === 'items') {
			var list = [];
			this.gridIncluded.getStore().each(function(record) {
				list.push(record.getId());
			});
			return list;
		}
		return null;
	},

/**z
	* Checks dirty state of current form
	*/
	checkDirty: function() {
		var record = this.getSelectedRecord();
		if (!record) {
			return;
		}
		if (record.phantom) {
			return;
		}
		var included = this.getFieldValue('items');
		var list = record.get('items');
		if (record.modified && record.modified['items']) {
			list = record.modified['items'];
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
		this.gridIncluded.getStore().clearFilter();
		this.gridAvailable.getStore().clearFilter();

		var before = record.get('items');
		var after = this.getFieldValue('items');

		var removed = Ext.Array.difference(before, after);
		var added = Ext.Array.difference(after, before);

		record.set('items_removed', removed);
		record.set('items_added', added);

		record.set('items', this.getFieldValue('items'));
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
		this.gridIncluded.getStore().clearFilter();
		this.gridAvailable.getStore().clearFilter();
		this.searchIncluded.reset();
		this.searchAvailable.reset();
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