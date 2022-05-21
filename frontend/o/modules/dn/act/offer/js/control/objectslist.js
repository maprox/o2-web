/**
 * @class O.lib.prodsupply.offer.ObjectsList
 */
C.utils.inherit('O.lib.prodsupply.offer.ObjectsList', {

/**
 * @event checkchange
 * Fires when some object in grids is checked/unchecked
 * @param {O.lib.prodsupply.offer.ObjectsList} this
 * @param {String} type Object type (region|warehouseclient|warehousemaster)
 * @param {Boolean} checked
 * @param {Ext.data.Record} record
 */
/**
 * @event selected
 * Fires when some object in grids is selected
 * @param {O.lib.prodsupply.offer.ObjectsList} this
 * @param {String} type Object type (region|warehouse)
 * @param {Ext.data.Record} record Selected record
 */


/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);

		var regionsStore = this.gridRegions.getStore();
		var recordRussia = regionsStore.findRecord('name', 'Россия');
		if (recordRussia) {
			recordRussia.set('important', true);
		}
		regionsStore.sort([
			{property : 'important', direction: 'DESC'},
			{property : 'name',      direction: 'ASC'}
		]);

		// set checkchange handlers
		var query = 'checkcolumn[dataIndex=checked]';
		var ccr = this.gridRegions.down(query);
		ccr.on('checkchange', 'onRegionCheckChange', this);
		var ccwm = this.gridMasterWarehouse.down(query);
		ccwm.on('checkchange', 'onMasterWarehouseCheckChange', this);
		var ccwc = this.gridClientWarehouse.down(query);
		ccwc.on('checkchange', 'onClientWarehouseCheckChange', this);

		// warehouse selection
		this.gridMasterWarehouse.on('itemclick', 'onSelectWarehouse', this);
		this.gridClientWarehouse.on('itemclick', 'onSelectWarehouse', this);

		// show only distributed warehouses
		this.gridMasterWarehouse.getStore().filter('distributed', 1);
		this.gridClientWarehouse.getStore().filter('distributed', 1);

		C.bind('dn_warehouse', this);
	},

/**
	* Executes when warehouse list is updated
	* @param {Object[]} data
	* @private
	*/
	onUpdateDn_warehouse: function(data) {
		this.updateWarehouseList(data, 'client');
	},

/**
	* Executes when warehouse list is updated
	* @param {Object[]} data
	* @private
	*/
	onUpdateDn_warehouse_list: function(data) {
		this.updateWarehouseList(data, 'master');
	},

/**
 	* Warehouse selection
 	* @param {Ext.view.View} this
 	* @param {Ext.data.Model} record
 	* @private
 	*/
	onSelectWarehouse: function(sm, record) {
		this.fireEvent('selected', this, 'warehouse', record);
	},

/**
	* Executes when warehouse list is updated
	* @private
	*/
	updateWarehouseList: function(data, type) {
		var checkedList = [];
		Ext.each(this.getCheckedWarehouses(), function(record) {
			checkedList.push(record.id);
		});
		var grid = (type === 'client') ?
			this.gridClientWarehouse : this.gridMasterWarehouse;
		grid.getStore().loadData(data);
		this.selectWarehouses(checkedList, type);
	},

/**
	 * Returns region by it's name
	 */
	getByRegionName: function(name) {
		var records = this.gridRegions.getStore().getRange();
		for (var i =0, l = records.length; i < l; i++) {
			if (this.convertName(records[i].get('name'))
					== this.convertName(name)
			) {
				return records[i];
			}
		}
	},

/**
	 * Converts region name\
	 * TODO: kostili
	 * @param name
	 */
	convertName: function(name) {
		return name.toLowerCase().replace(/\s*\(.+\)\s*/, '')
			.replace(/республика\s+/, '').replace(/\s-\s.+/, '')
			.replace(/чувашия$/, 'чувашская республика')
			.replace(/северная осетия$/, 'северная осетия-алания');
	},

/**
	* Handler on changing check state of region in regions grid
	* @param {Ext.menu.CheckItem} this
	* @param {Number} index
	* @param {Boolean} checked
	*/
	onRegionCheckChange: function(column, index, checked) {
		var record = this.gridRegions.getStore().getAt(index);
		this.fireEvent('checkchange', this, 'region', checked, record);
	},

/**
	* Handler on changing check state of region in regions grid
	* @param {Ext.menu.CheckItem} this
	* @param {Number} index
	* @param {Boolean} checked
	*/
	onMasterWarehouseCheckChange: function(column, index, checked) {
		var record = this.gridMasterWarehouse.getStore().getAt(index);
		this.fireEvent('checkchange', this, 'warehousemaster', checked, record);
	},

/**
	* Handler on changing check state of region in regions grid
	* @param {Ext.menu.CheckItem} this
	* @param {Number} index
	* @param {Boolean} checked
	*/
	onClientWarehouseCheckChange: function(column, index, checked) {
		var record = this.gridClientWarehouse.getStore().getAt(index);
		this.fireEvent('checkchange', this, 'warehouseclient', checked, record);
	},

/**
	* Returns an array of checked regions in regions grid
	* @param {Boolean} toObjects True to return as an array of objects
	* @return {String[]/Object[]}
	*/
	getCheckedRegions: function(toObjects) {
		var regions = [];
		var store = this.gridRegions.getStore();
		store.each(function(record) {
			if (record.get('checked')) {
				regions.push((!toObjects) ? record.get('name') : {
					id: record.get('id'),
					name: record.get('name')
				});
			}
		}, this);
		return regions;
	},

/**
	* Returns a list of selected warehouses
	* @return {Object[]} list of selected
	*/
	getCheckedWarehouses: function() {
		var warehouses = [];
		var fn = function(record) {
			if (record.get('checked')) {
				warehouses.push(record.data);
			}
		}
		this.gridMasterWarehouse.getStore().each(fn);
		this.gridClientWarehouse.getStore().each(fn);
		return warehouses;
	},

/**
	* Unchecks all regions in regions grid
	*/
	uncheckAllRegions: function() {
		this.gridRegions.getStore().each(function(record) {
			if (!record.get('important')) {
				record.set('checked', false);
			}
		});
	},

/**
	* Selects specified regions
	* @param {String[]} list Region names array
	*/
	selectRegions: function(list) {
		this.gridRegions.getStore().each(function(record) {
			var value = (Ext.Array.indexOf(list, record.get('name')) >= 0);
			if (!record.get('important')) {
				record.set('checked', value);
			}
		});
	},

/**
	* Selects specified supplier warehouses
	* @param {Number[]} list Warehouses ids array
	* @param {String} type Type of a grid (client|master)
	*/
	selectWarehouses: function(list, type) {
		var grid = (type === 'client') ?
			this.gridClientWarehouse : this.gridMasterWarehouse;
		grid.getStore().each(function(record) {
			var value = (Ext.Array.indexOf(list, record.getId()) >= 0);
			record.set('checked', value);
		});
	}

});