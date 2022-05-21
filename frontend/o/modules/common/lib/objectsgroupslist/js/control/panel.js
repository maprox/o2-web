/**
 *
 * @class O.lib.ObjectsGroupsList
 * @extends C.ui.Panel
 */
C.utils.inherit('O.lib.ObjectsGroupsList', {

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden();
		this.tabpanel = this.down('tabpanel');
		this.on('afterrender', 'onAfterRender', this);
	},

/**
	* Handler for afterrender event
	*/
	onAfterRender: function() {
		if (!this.width) {
			this.setWidth(400);
		}
	},

/**
	* State save handling
	*/
	getState: function() {
		var o = {
			selectedItems: this.getSelectedItems(),
			checkedItems: this.getCheckedItems(),
			collapsed: this.collapsed
		};
		if (!this.collapsed && this.width) {
			o['width'] = this.width;
		}
		return o;
	},

	applyState: function(state) {
		if (state) {
			this.selectedItems = state.selectedItems;
			this.checkedItems = state.checkedItems;
		}
	},

/**
	* Returns currently active groups list
	* @return {O.lib.abstract.GroupsList}
	*/
	getCurrentGroupsList: function() {
		return this.tabpanel.getActiveTab();
	},

/**
	* Returns panel with list of zones
	*/
	getZonesPanel: function() {
		if (!this.panelZones) {
			this.panelZones = this.tabpanel.down('listgroupszones');
		}
		return this.panelZones;
	},

/**
	* Returns panel with list of devices
	*/
	getDevicesPanel: function() {
		if (!this.panelDevices) {
			this.panelDevices = this.tabpanel.down('listgroupsdevices');
		}
		return this.panelDevices;
	},

	/**
	 * Returns panel with list of devices
	 */
	getVehiclesPanel: function() {
		if (!this.panelVehicles) {
			this.panelVehicles = this.tabpanel.down('listgroupsvehicles');
		}
		return this.panelVehicles;
	},

/**
	* Returns config array with child panels
	*/
	getItems: function() {
		var listRev = this.reverseObjectSelectionModeFor || [];
		var list = this.callOverridden();
		Ext.each(this.panels, function(className) {
			var selModeObjects = this.multiSelectObjects;
			var selModeGroups = this.multiSelectGroups;
			if (Ext.isArray(listRev)) {
				if (Ext.Array.indexOf(listRev, className) >= 0) {
					selModeObjects = !selModeObjects;
				}
			}
			var groupsListPanel = Ext.create(className, {
				multiSelectObjects: selModeObjects,
				multiSelectGroups: selModeGroups,
				showSelectAllObjects: selModeObjects ?
					this.showSelectAllObjects : false
			});

			// @TODO: вернуть нормальный relayEvents когда mon_vehicle станет самостоятельной сущностью
			groupsListPanel.on({
				selectionchange: function(){
					this.relayPanelEvent.call(this,
						'selectionchange', arguments)
				},
				select: function(){
					this.relayPanelEvent.call(this,
						'select', arguments)
				},
				deselect: function(){
					this.relayPanelEvent.call(this,
						'deselect', arguments)
				},
				afterload: function(){
					this.relayPanelEvent.call(this,
						'afterload', arguments)
				},
				check: function(){
					this.relayPanelEvent.call(this,
						'check', arguments)
				},
				uncheck: function(){
					this.relayPanelEvent.call(this,
						'uncheck', arguments)
				},
				checkchange: function(){
					this.relayPanelEvent.call(this,
						'checkchange', arguments)
				},
				scope: this
			});
			list.push(groupsListPanel);
		}, this);
		return list;
	},

	/**
	 * @TODO: удалить когда mon_vehicle станет самостоятельной сущностью
	 * Convert mon_vehicle events to mon_device events
	 * @param event
	 * @param args
	 */
	relayPanelEvent: function(event, args) {
		// convert to normal array
		args = Array.prototype.slice.call(args);
		var list = args.shift();

		var focused = list.getSelectedObjectId(),
			selected = list.getSelectedObjects(),
			alias = list.getClassAlias();

		if (alias == 'mon_vehicle') {
			var newSelected = [];

			var vehicles = C.get('mon_vehicle');
			var vehicle = vehicles.getByKey(focused);
			if (vehicle && vehicle.id_device) {
				focused = vehicle.id_device;
			} else {
				focused = false;
			}

			Ext.Array.each(selected, function(item){
				var vehicle = vehicles.getByKey(item);
				if (vehicle && vehicle.id_device) {
					newSelected.push(vehicle.id_device);
				}
			});

			if (list.getMultiSelectObjects()) {
			newSelected = newSelected.concat(
				this.getDevicesPanel().getSelectedObjects());
			}

			selected = Ext.Array.unique(newSelected);
			alias = 'mon_device';
		}

		args.unshift(focused);
		args.unshift(selected);
		args.unshift(alias);
		args.unshift(event);
		this.fireEvent.apply(this, args);
	},

/**
	* Returns selected identifiers
	*/
	getCheckedItems: function() {
		var items = [];
		var len = this.panels.length;
		for (var i = 0; i < len; i++) {
			var alias  = this.panels[i].substr(12).toLowerCase();
			items = Ext.Array.merge(items,
				this.down('listgroups' + alias).getSelectedItems());
		}
		return items;
	},

/**
	* Returns selected identifiers
	*/
	getSelectedItems: function() {
		var items = {};
		var len = this.panels.length;
		for (var i = 0; i < len; i++) {
			var alias  = this.panels[i].substr(12).toLowerCase();
			items[alias] = this.down('listgroups' + alias).getSelectedObjectId();
		}
		return items;
	},

/**
	* Checks items in subpanels
	* @param {Array} items
	*/
	checkItems: function(items) {
		var len = this.panels.length;
		for (var i = 0; i < len; i++) {
			var alias  = this.panels[i].substr(12).toLowerCase();
			this.down('listgroups' + alias).checkItems(items);
		}
	},


/**
	* Checks items in subpanels
	* @param {Array} items
	*/
	selectItems: function(items) {
		var len = this.panels.length;
		for (var i = 0; i < len; i++) {
			var alias  = this.panels[i].substr(12).toLowerCase();
			this.down('listgroups' + alias).selectObjectId(items[alias]);
		}
	},

/**
	* Restores selection from state
	*/
	restoreSelection: function() {
		this.checkItems(this.checkedItems || []);
		this.selectItems(this.selectedItems || []);
	}
});
