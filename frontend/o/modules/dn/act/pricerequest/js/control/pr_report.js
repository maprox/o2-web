/**
 * @class O.dn.act.pricerequest.Report
 */
C.inherit('O.dn.act.pricerequest.Report', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.btnExport) {
			this.btnExport.setHandler(this.btnExportHandler, this);
		}
		if (this.btnSwap) {
			this.btnSwap.setHandler(this.btnSwapHandler, this);
		}
		if (this.btnTotals) {
			this.btnTotals.on('toggle', 'btnTotalsToggle', this);
		}
		if (this.btnGroupRegion) {
			this.btnGroupRegion.setHandler(this.groupRegion, this);
		}
		if (this.btnGroupProduct) {
			this.btnGroupProduct.setHandler(this.groupProduct, this);
		}
		if (this.btnGroupOff) {
			this.btnGroupOff.setHandler(this.groupOff, this);
		}

		this.supplierStore = Ext.data.StoreManager.lookup(
			'storeSupplierAccount');
		if (this.supplierStore) {
			this.supplierStore.on('load',
				Ext.bind(this.hideDisabled, this, []));
		}

		this.on('afterrender', 'onAfterRender', this);

	},

/**
	* After render handler
	*/
	onAfterRender: function() {
		this.reloadData(this._config);
	},

/**
	* Hide disabled
	* @param {Boolean} hide
	*/
	hideDisabled: function(hide) {
		this.rebuildGrid(null, this.getConfig(typeof(hide) !== "undefined" ? {
			hideDisabled: hide
		} : {}));
	},

/**
	* Reloads data with specified config
	* @param {Object} config
	*/
	reloadData: function(config) {
		this._config = this.getConfig(config);
		if (!this.rendered) { return; }
		this.setLoading(true);
		Ext.Ajax.request({
			url: '/dn_analytic_report/tender',
			method: 'GET',
			params: {
				id_tender: config.id_tender
			},
			callback: function(opts, success, response) {
				this.setLoading(false);
				// ajax failure
				if (!success) { return; }
				// server response
				var answer = C.utils.getJSON(response.responseText, opts);
				if (!answer.success) { return; }
				this.rebuildGrid(answer.data, this._config);
				this.fireEvent('reload', this, {
					data: this._data,
					config: this._config
				});
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
		if (!this.rendered) { return; }
		var warehousePrefix = '# ';
		if (!data && !this._data) {
			// reload data if no data is loaded
			return this.reloadData(config);
		}
		// get all the data that we need to rebuild grid
		var dn_product = C.get('dn_product');
		var dn_region = C.get('dn_region');
		var dn_warehouse = C.get('dn_warehouse');

		var dn_supplier = new Ext.util.MixedCollection();
		this.supplierStore.each(function(item) {
			dn_supplier.add(item.data);
		}, this);

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

		if (this._config.hideDisabled) {
			dn_supplier = dn_supplier.filterBy(function(supplier) {
				return (supplier.state != C.cfg.RECORD_IS_DISABLED);
			});
		}

		var isTotals = config && config.totals;
		var isReverse = config && config.reverse;
		// create store fields
		var storefields = [
			{name: 'id', type: 'string'},
			{name: 'amount', type: 'float'},
			{name: 'place', type: 'string'},
			{name: 'product', type: 'string'}
		];
		if (isReverse) {
			storefields = [
				{name: 'id', type: 'string'},
				{name: 'amount', type: 'float'},
				{name: 'place', type: 'string'},
				{name: 'supplier', type: 'string'}
			];
		}
		// new grid columns initialization
		var columns = [{
			itemId: 'colProduct',
			header: isReverse ? _('Supplier') : _('Product'),
			locked: true,
			width: 200,
			dataIndex: isReverse ? 'supplier' : 'product'
		}, {
			header: _('Product amount'),
			locked: true,
			width: 120,
			align: 'right',
			dataIndex: 'amount'
		}, {
			itemId: 'colRegion',
			header: _('Region') + ' / ' + _('Warehouse'),
			locked: true,
			width: 150,
			dataIndex: 'place'
		}];
		var grid = this.grid;
		var columnsLinks = {};
		var minValues = {};
		((isReverse) ? dn_product : dn_supplier).each(function(item) {
			var columnName = isReverse ? item.name :
				item.firm_client.company.name;
			var fieldName = 'f' + item.id;
			storefields.push({name: fieldName, type: 'float', useNull: true});
			var fnFormatValue = function(value, hideNull) {
				return value ? Ext.util.Format.round(value, 2) :
					(hideNull ? '' : value);
			}
			var column = {
				xtype: 'numbercolumn',
				header: columnName,
				dataIndex: fieldName,
				align: 'right',
				groupable: false,
				menuDisabled: true,
				hidden: true,
				summaryType: 'sum',
				summaryRenderer: function(value) {
					return fnFormatValue(value, true);
				},
				renderer: function(value, meta, record) {
					// reverse coloring is not supported
					if (isReverse || !record) {
						return fnFormatValue(value);
					}
					var id = record.getId();
					if ((typeof(value) != 'undefined')
							&& (value !== null)
							&& !minValues[id]) {
						minValues[id] = value;
						Ext.each(storefields, function(field) {
							if (field.type !== 'float') { return; }
							if (field.name === 'amount') { return; }
							var val = record.get(field.name);
							if ((typeof(val) != 'undefined')
									&& (val !== null)
									&& (val < minValues[id])) {
								minValues[id] = val;
							}
						});
					}
					if (value == minValues[id]) {
						meta.tdCls = 'minimal-value';
					}
					return fnFormatValue(value);
				}
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
			// skipped supplier
			var supplier = dn_supplier.getByKey(offer.id_firm);
			if (offer.id_firm && !supplier) { return true; }
			Ext.each(offer.data, function(item) {
				var recordId = (isReverse ? offer.id_firm : item.id_product) +
					'|' + item.id_region +
					'|' + item.id_warehouse;
				var recordFields = {
					id: recordId,
					amount: item.amount
				};
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
				if (columnsLinks[itemFieldName]) {
					columnsLinks[itemFieldName]['hidden'] = false;
				}
				recordFields[itemFieldName] = isTotals
					? item.price * item.amount : item.price;
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
		// new store initialization
		var gridColumns = [];
		Ext.each(columns, function(column) {
			if (!column.hidden) {
				gridColumns.push(column);
			}
		});
		store.resumeEvents();
		this.grid.reconfigure(store, gridColumns);
		// sort the store
		store.sort(isReverse ? 'supplier' : 'product', 'ASC');
		// group the store
		if (this._config.groupBy) {
			store.group(this._config.groupBy);
		}
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
		Ext.ux.GridPrinter.doExport({
			filename: _('Consolidated report'),
			title: _('The consolidated report of the tender'),
			sheets: [{
				grid: this.grid,
				header: _('The consolidated report of the tender')
			}]
		});
	},

/**
	* Handling of "Totals" button toggle
	* @param {Ext.button.Button} btn
	* @param {Boolean} pressed
	*/
	btnTotalsToggle: function(btn, pressed) {
		if (this._config) {
			this._config.totals = pressed;
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
	* Returns last config object
	* @param {Object} Additional config data
	* @return {Object}
	*/
	getConfig: function(config) {
		return Ext.apply(this._config || {}, config || {});
	},

/**
	* Group by Region
	* @param {Ext.button.Button} btn
	*/
	groupRegion: function(btn) {
		if (btn.pressed) {
			//this.down('#colProduct').show();
			//this.down('#colCode').show();
			//this.down('#colRegion').hide();
			this.grid.getStore().group('place');
			if (this._config) {
				this._config.groupBy = 'place';
			}
		} else {
			btn.toggle();
		}
	},

/**
	* Group by Product
	* @param {Ext.button.Button} btn
	*/
	groupProduct: function(btn) {
		if (btn.pressed) {
			//this.down('#colRegion').show();
			//this.down('#colProduct').hide();
			//this.down('#colCode').hide();
			this.grid.getStore().group('product');
			if (this._config) {
				this._config.groupBy = 'product';
			}
		} else {
			btn.toggle();
		}
	},

/**
	* Turn off grouping
	* @param {Ext.button.Button} btn
	*/
	groupOff: function(btn) {
		if (btn.pressed) {
			//this.down('#colRegion').show();
			//this.down('#colProduct').show();
			//this.down('#colCode').show();
			this.grid.getStore().clearGrouping();
			if (this._config) {
				this._config.groupBy = null;
			}
		} else {
			btn.toggle();
		}
	}

});
