Ext.define('O.mon.lib.command.param.List', {
	extend: 'O.mon.lib.command.param.Abstract',
	alias: 'widget.mon-lib-command-param-list',

/**
	* @constructor
	*/
	constructor: function(options) {
		this.callParent(arguments);
		// Items
		var items = this.info.items;

		// Prepare list store data
		var listData = [];
		var fields = ['value'];

		// Check if list is extended
		if (items[0] && items[0].name) {
			// Extended list
			Ext.Array.each(items, function(item) {
				listData.push({
					name: _(item.name),
					value: item.value
				});
			});

			fields.push('name');
			this.fieldParams.displayField = 'name';
		} else {
			// Simple list
			Ext.Array.each(items, function(val) {
				listData.push({
					value: val
				});
			});

			this.fieldParams.displayField = 'value';
		}

		// Create store with allowed values
		this.listStore = Ext.create('Ext.data.Store', {
			fields: fields,
			data: listData
		});
	},

/**
	 * Returns field
	 */
	getField: function() {
		this.callParent(arguments);

		var params = this.fieldParams;

		var value = null;
		var firstItem = this.listStore.getAt(0);
		if (firstItem) {
			value = firstItem.get('value');
		}

		params = Ext.apply(params, {
			store: this.listStore,
			queryMode: 'local',
			//displayField: 'value',
			valueField: 'value',
			editable: false,
			allowBlank : false,
			forceSelection: true,
			value: value
		});

		var field = Ext.create('Ext.form.ComboBox', params);

		return field;
	}
});
