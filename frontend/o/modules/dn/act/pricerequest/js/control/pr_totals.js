/**
 * @class O.dn.act.pricerequest.Totals
 */
C.inherit('O.dn.act.pricerequest.Totals', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.btnExport) {
			this.btnExport.setHandler(this.btnExportHandler, this);
		}
		if (this.btnTotals) {
			this.btnTotals.on('toggle', 'btnTotalsToggle', this);
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
		if (config) {
			this.rebuildGrid(config.data, config.config);
		}
	},

/**
	* Rebuilds grid with new data
	* @param {Object[]} data List of offer values
	* @param {Object} config Grid view configuration
	*/
	rebuildGrid: function(data, config) {
		//if (!this.rendered) { return; }
		var warehousePrefix = '# ';
		if (!data && !this._data) { return; }
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
		this._config = config || {};

		if (this._config.hideDisabled) {
			dn_supplier = dn_supplier.filterBy(function(supplier) {
				return (supplier.state != C.cfg.RECORD_IS_DISABLED);
			});
		}

		var isTotals = config && config.totals;
		var prelist = {};

		Ext.each(this._data, function(offer) {
			var supplier = dn_supplier.getByKey(offer.id_firm);
			if (offer.id_firm && !supplier) { return true; }
			Ext.each(offer.data, function(item) {
				var product = dn_product.getByKey(item.id_product);
				if (!product || !product.name) { return; }
				product = product.name;
				var place = '';
				if (item.id_region) {
					place = dn_region.getByKey(item.id_region);
					if (place) {
						place = place.name;
					}
				} else {
					place = dn_warehouse.getByKey(item.id_warehouse);
					if (place) {
						place = warehousePrefix + place.name;
					}
				}
				// insert item into prepared list
				if (!prelist[product]) {
					prelist[product] = {};
				}
				if (!prelist[product][place]) {
					prelist[product][place] = [];
				}
				prelist[product][place].push({
					id_firm: offer.id_firm,
					supplier: (typeof (supplier) != "undefined") ?
						supplier.firm_client.company.name : null,
					price: item.price,
					amount: item.amount
				});
				Ext.Array.sort(prelist[product][place], function(a, b) {
					return a.price - b.price;
				});
			});
		});

		// clear store
		var store = this.store;
		//store.suspendEvents();
		store.removeAll();
		C.utils.each(prelist, function(pr_list, product) {
			C.utils.each(pr_list, function(list, place) {
				var record = {
					id: product + '|' + place,
					product: product,
					place: place
				};
				for (var i = 1; i <= list.length; i++) {
					var item = list[i - 1];
					var price = item.price;
					record['amount'] = item.amount;
					record['s' + i] = item.supplier;
					record['s' + i + 'price'] = isTotals ?
						(price ? price * item.amount : null) : price;
				}
				store.add(record);
			});
		});
		store.sort('product', 'ASC');
		store.resumeEvents();
		store.commitChanges();
		//this.gridDistribution.getView().refresh();
		//this.gridTotals.getView().refresh();
	},

/**
	* Export button handler
	*/
	btnExportHandler: function() {
		Ext.ux.GridPrinter.doExport({
			filename: _('Tender totals'),
			title: _('Tender totals'),
			sheets: [{
				grid: this.gridDistribution,
				name: _('Distribution by places'),
				header: _('Distribution by places')
			}, {
				grid: this.gridTotals,
				name: _('Tender totals'),
				header: _('Tender totals')
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
	}

});
