/**
 * @class M.lib.objectsgroupslist.Panel
 */
C.utils.inherit('M.lib.objectsgroupslist.Panel', {

	/**
	 * @construct
	 * @override
	 */
	initialize: function() {
		// call overridden
		this.callOverridden(arguments);
		var events = [
			'select',
			'deselect',
			'selectionchange',
			'check',
			'uncheck',
			'checkchange'
		];
		for (var alias in this.mapItems) {
			if (this.mapItems.hasOwnProperty(alias)) {
				this.relayEvents(this.mapItems[alias], events);
			}
		}
		/*
		 * The problem:
		 * applyMultiSelectDevices/Geofences is called before child
		 * panels are created, so the value of multiselection does not
		 * applied for them.
		 * This dirty code reapplies multiselection option for them.
		 */		
		this.setMultiSelectDevices(this.getMultiSelectDevices());
		this.setMultiSelectGeofences(this.getMultiSelectGeofences());
	},

/**
	* Allow (or disallow) multiple selection of devices
	* @param {Boolean} value
	*/
	applyMultiSelectDevices: function(value) {
		var panel = this.getCustomPanel('mon_device');
		if (panel && panel.setMultiSelectObjects) {
			panel.setMultiSelectObjects(value);
		}
		return value;
	},

/**
	* Allow (or disallow) multiple selection of geofences
	* @param {Boolean} value
	*/
	applyMultiSelectGeofences: function(value) {
		var panel = this.getCustomPanel('mon_geofence');
		if (panel && panel.setMultiSelectObjects) {
			panel.setMultiSelectObjects(value);
		}
		return value;
	},

/**
	* Returns currently active groups list
	* @return {O.lib.abstract.GroupsList}
	*/
	getCurrentGroupsList: function() {
		return this.tabpanel.getActiveTab();
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
	* Search handler
	* @param {String} seatchString Search string
	*/
	search: function(searchString) {
		var groupslist = this.getCurrentGroupsList();
		if (groupslist) {
			groupslist.search(searchString);
		}
	},

/**
	* Returns a panel instance by its name
	* @param {String} name
	* @return Ext.Panel
	*/
	getCustomPanel: function(alias) {
		if (!this.panelCache) { this.panelCache = {}; }
		if (typeof(this.panelCache[alias]) == 'undefined'
				|| !this.panelCache[alias]) {
			this.panelCache[alias] =
				this.down('component[itemAlias=' + alias + ']');
		}
		return this.panelCache[alias];
	},

/**
	* Returns checked identifiers
	*/
	getCheckedItems: function() {
		var items = {};
		var len = this.panels.length;
		for (var i = 0; i < len; i++) {
			var alias  = this.panels[i];
			var panel = this.getCustomPanel(alias);
			if (panel) {
				items[alias] = panel.getCheckedObjects();
			}
		}
		return items;
	},

/**
	* Returns checked devices identifiers
	*/
	getCheckedDevices: function() {
		return this.getCheckedItems().mon_device;
	},

/**
	* Returns checked geofences identifiers
	*/
	getCheckedGeofences: function() {
		return this.getCheckedItems().mon_geofence;
	},

/**
	* Returns selected identifiers
	*/
	getSelectedItems: function() {
		var items = {};
		var len = this.panels.length;
		for (var i = 0; i < len; i++) {
			var alias  = this.panels[i];
			var panel = this.getCustomPanel(alias);
			if (panel) {
				items[alias] = panel.getSelectedObjectId();
			}
		}
		return items;
	},

/**
	* Returns selected device identifier
	*/
	getSelectedDevices: function() {
		return this.getSelectedItems().mon_device;
	},

/**
	* Returns selected goefence identifier
	*/
	getSelectedGeofences: function() {
		return this.getSelectedItems().mon_geofence;
	},

/**
	* Checks items in subpanels
	* @param {Object} items
	*/
	checkItems: function(items) {
		for (var i = 0, l = this.panels.length; i < l; i++) {
			var alias  = this.panels[i];
			if (items[alias]) {
				var panel = this.getCustomPanel(alias);
				if (panel) {
					panel.checkObjects(items[alias]);
				}
			}
		}
	},

/**
	* Checks devices in subpanel
	* @param {Number[]} items
	*/
	checkDevices: function(items) {
		this.checkItems({mon_device: items});
	},

/**
	* Checks geofences in subpanel
	* @param {Number[]} items
	*/
	checkGeofences: function(items) {
		this.checkItems({mon_geofence: items});
	},


/**
	* Checks items in subpanels
	* @param {Object} items
	*/
	selectItems: function(items) {
		for (var i = 0, l = this.panels.length; i < l; i++) {
			var alias  = this.panels[i];
			if (items[alias]) {
				var panel = this.getCustomPanel(alias);
				if (panel) {
					panel.selectObjectId(items[alias]);
				}
			}
		}
	},

/**
	* Checks items in subpanels
	* @param {Number} id
	*/
	selectDevice: function(id) {
		this.selectItems({mon_device: id});
	},

/**
	* Checks items in subpanels
	* @param {Number} id
	*/
	selectGeofence: function(id) {
		this.selectItems({mon_geofence: id});
	},

/**
	* Restores selection from state
	*/
	restoreSelection: function() {
		this.checkItems(this.checkedItems || []);
		this.selectItems(this.selectedItems || []);
	}
});
