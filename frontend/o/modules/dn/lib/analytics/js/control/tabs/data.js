/**
 * @class O.dn.lib.analytics.tab.Data
 */
C.utils.inherit('O.dn.lib.analytics.tab.Data', {
/**
	* @event findonmap
	* Fires when user press "find on map" button
	*/
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.btnReload) {
			this.btnReload.setHandler(this.btnReloadHandler, this);
		}
		if (this.btnExport) {
			this.btnExport.setHandler(this.btnExportHandler, this);
		}
		if (this.btnSwap) {
			this.btnSwap.setHandler(this.btnSwapHandler, this);
		}
		if (this.btnShowNulls) {
			this.btnShowNulls.setHandler(this.btnShowNullsHandler, this);
		}
	},

/**
	* Data reloading handler
	*/
	btnReloadHandler: function() {
		this.reloadData();
	},

/**
	* Reloads data with specified config
	* @param {Object} config
	*/
	reloadData: function(config) {
		this.setLoading(true);
		this._config = this.getConfig(config);
		Ext.Ajax.request({
			url: '/dn_analytic_report/data',
			method: 'GET',
			params: {
				period_sdt: this._config.period_sdt,
				period_edt: this._config.period_edt
			},
			callback: function(opts, success, response) {
				this.setLoading(false);
				// ajax failure
				if (!success) { return; }
				// server response
				var answer = C.utils.getJSON(response.responseText, opts);
				if (!answer.success) { return; }
				this.rebuildGrid(answer.data, this._config);
			},
			scope: this
		});
	},

/**
	* Rebuilds grid with new data
	* @param {Object[]} data List of offer values
	* @param {Object} config Grid view configuration
	*/
	rebuildGrid: function(data, config) {
		var warehousePrefix = '# ';
		if (!data && !this._data) {
			// reload data if no data is loaded
			return this.reloadData(config);
		}
		// get all the data that we need to rebuild grid
		var dn_supplier = C.get('dn_supplier');
		var dn_product = C.get('dn_product');
		var dn_region = C.get('dn_region');
		var dn_warehouse = C.get('dn_warehouse');

		// filter collections
		var filterFn = function(collection, list, idFieldName) {
			if (!list) { return Ext.create('Ext.util.MixedCollection'); }
			return collection.filterBy(function(item) {
				var res = Ext.Array.indexOf(list, item[idFieldName || 'id']) >= 0;
				return res;
			});
		};
		dn_supplier = filterFn(dn_supplier, config.dn_supplier);
		dn_product = filterFn(dn_product, config.dn_product);
		dn_region = filterFn(dn_region, config.dn_region);
		dn_warehouse = filterFn(dn_warehouse, config.dn_warehouse);

		// check availability of stores
		if (!dn_supplier ||
			!dn_product ||
			!dn_region ||
			!dn_warehouse) { return; }

		// save local data
		this._data = data ? data : this._data || {};
		this._config = config || {
			shownulls: true,
			reverse: false
		};

		var isReverse = config && config.reverse;
		// create store fields
		var storefields = [
			{name: 'id', type: 'string'},
			{name: 'place', type: 'string'},
			{name: 'product', type: 'string'}
		];
		if (isReverse) {
			storefields = [
				{name: 'id', type: 'string'},
				{name: 'place', type: 'string'},
				{name: 'supplier', type: 'string'}
			];
		}
		// new grid columns initialization
		var columns = [{
			header: isReverse ? _('Supplier') : _('Product'),
			locked: true,
			width: 200,
			dataIndex: isReverse ? 'supplier' : 'product'
		}, {
			header: _('Region') + ' / ' + _('Warehouse'),
			locked: true,
			width: 150,
			dataIndex: 'place'
		}];
		var columnsLinks = {};
		((isReverse) ? dn_product : dn_supplier).each(function(item) {
			var columnName = isReverse ? item.name :
				item.firm_client.company.name;
			var fieldName = 'f' + item.id;
			storefields.push({name: fieldName, type: 'float', useNull: true});
			var column = {
				xtype: 'numbercolumn',
				header: columnName,
				dataIndex: fieldName,
				align: 'right',
				groupable: false,
				menuDisabled: true,
				hidden: true
			};
			columns.push(column);
			columnsLinks[fieldName] = column;
		});
		// store data initialization
		var storedata = [];
		var store = Ext.create('Ext.data.Store', {
			fields: storefields,
			data: storedata
		});
		store.suspendEvents();
		// load data into store
		if (!Ext.isArray(this._data)) { this._data = [this._data]; }
		//var nullColumns = [];
		Ext.each(this._data, function(offer) {
			if (!offer) { return; }
			var itemFieldName = 'f' + offer.id_firm;
			var supplierName = '';
			// skipped supplier
			var supplier = dn_supplier.getByKey(offer.id_firm);
			if (!supplier) { return true; }
			Ext.each(offer.data, function(item) {
				var recordId = (isReverse ? offer.id_firm : item.id_product) +
					'|' + item.id_region +
					'|' + item.id_warehouse;
				var recordFields = {id: recordId};
				// skip record
				if (item.id_region) {
					if (!dn_region.getByKey(item.id_region)) {
						return true;
					}
				}
				if (item.id_warehouse) {
					if (!dn_warehouse.getByKey(item.id_warehouse)) {
						return true;
					}
				}
				if (!dn_product.getByKey(item.id_product)) { return true; }
				if (isReverse) {
					itemFieldName = 'f' + item.id_product;
					recordFields['supplier']
						= supplier.firm_client.company.name;
				}
				columnsLinks[itemFieldName]['hidden'] = false;
				recordFields[itemFieldName] = item.price;
				var product = dn_product.getByKey(item.id_product);
				if (product) {
					recordFields['product'] = product.name;
				}
				var place = 0;
				if (item.id_region) {
					place = dn_region.getByKey(item.id_region);
					if (place) {
						recordFields['place'] = place.name;
					}
				} else {
					place = dn_warehouse.getByKey(item.id_warehouse);
					if (place) {
						recordFields['place'] = warehousePrefix + place.name;
					}
				}
				var record = store.getById(recordId);
				if (!record) {
					record = store.add(recordFields);
				} else {
					record.set(recordFields);
					record.commit();
				}
			});
		});
		store.resumeEvents();
		// new store initialization
		var gridColumns = [];
		Ext.each(columns, function(column) {
			if (!column.hidden) {
				gridColumns.push(column);
			}
		});
		this.grid.reconfigure(store, gridColumns);
		// sort the store
		store.sort(isReverse ? 'supplier' : 'product', 'ASC');
	},

/**
	* btnSwap click handler.
	* Swaps columns of a grid
	*/
	btnSwapHandler: function() {
		if (this._config) {
			this._config.reverse = !this._config.reverse;
		}
		this.setLoading(true);
		Ext.defer(function() {
			try {
				this.rebuildGrid(this._data, this._config);
			} catch (e) {
				// silent exception
			}
			this.setLoading(false);
		}, 1, this);
	},

/**
	* Export button handler
	*/
	btnExportHandler: function() {
		var record = this.getSelectedRecord();
		if (!record) { return; }
		Ext.ux.GridPrinter.doExport({
			filename: record.get('name'),
			title: _('The analytic report of commercial offers'),
			sheets: [{
				grid: this.grid,
				header: _('The analytic report of commercial offers')
			}]
		});
	},

/**
	* Returns last config object
	* @param {Object} Additional config data
	* @return {Object}
	*/
	getConfig: function(config) {
		return Ext.apply(this._config || {}, config || {});
	}

});
