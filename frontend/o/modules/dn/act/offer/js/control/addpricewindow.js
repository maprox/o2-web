/**
 * @class O.lib.prodsupply.offer.AddPriceWindow
 */
C.utils.inherit('O.lib.prodsupply.offer.AddPriceWindow', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);

		this.btnChooseRegion.on('toggle', this.onChooseRegionToggle, this);
		this.btnAddWarehouse.setHandler(this.addWarehouse, this);

		this.btnReset.setHandler(this.onResetClick, this);
		this.btnCancel.setHandler(this.onCancelClick, this);
		this.btnAdd.setHandler(this.onAddClick, this);
		this.searchField.on('change', this.search, this);

		this.editor.on({
			afteredit: this.onAfterEdit,
			scope: this
		});

		this.objectsList.on({
			checkchange: this.onObjectsListCheckChange,
			selected: this.onObjectsListSelected,
			scope: this
		});
		this.regionChooser.on({
			selectionchange: this.onRegionChooserSelectionChange,
			scope: this
		});

		this.on({
			show: this.onShowWindow,
			hide: this.onHideWindow,
			scope: this
		});

		// ui update
		this.updateUi(true);
	},

/**
	* User interface update
	* @param {Boolean} firstCall
	* @protected
	*/
	updateUi: function(firstCall) {
		if (firstCall) {
			this.btnAddWarehouse.setDisabled(
				!C.userHasRight('module_warehouse'));
		}
		this.btnAddWarehouse.setDisabled(
			!C.manager.Auth.canCreate('dn_warehouse'));
	},

/**
	* Returns warehouse collection
	* @return Ext.util.MixedCollection
	*/
	getWarehouseList: function() {
		if (!this.warehouseList) {
			this.warehouseList = new Ext.util.MixedCollection();
		}
		return this.warehouseList;
	},

/**
	* Handler on changing check state of region/warehouse in regions grid
	* @param {O.lib.prodsupply.offer.ObjectsList} cmp
	* @param {String} type Object type (region|warehouseclient|warehousemaster)
	* @param {Boolean} checked
	* @param {Ext.data.Model} record
	*/
	onObjectsListCheckChange: function(cmp, type, checked, record) {
		var rc = this.regionChooser;
		switch (type) {
			case 'region':
				var region = record.get('name');
				if (checked) {
					rc.selectRegion(region);
				} else {
					rc.deselectRegion(region);
				}
				if (!this.regionChooser.isLoaded()) {
					if (checked) {
						this.regions.push(record.data.name);
					} else {
						var regions = [];
						for (var i = 0, l = this.regions.length; i < l; i++) {
							if (this.regions[i] != record.data.name) {
								regions.push(this.regions[i]);
							}
						}
						this.regions = regions;
					}
					this.changeAmount(type, checked, record);
				}
				break;
			case 'warehouseclient':
			case 'warehousemaster':
				this.regionChooserAddObject(type, record, checked);
				break;
		}
	},

	changeAmount: function(type, checked, record) {
		var  products = this.proxyStore.getRange(),
			recordId = record.getId();
		for (var i = 0, l = products.length; i < l; i++) {
			var p = products[i],
				amount = p.data.amount,
				value = this.feednormProxy
					.getValue(recordId, type, p.data.id);
			if (checked) {
				amount += value;
			} else {
				amount -= value;
			}
			p.set('amount', amount.toFixed(1));
		}
		this.gridProducts.getStore().load();
	},

/**
	* Handler of selection object in regions grid
	* @param {O.lib.prodsupply.offer.ObjectsList} cmp
	* @param {String} type Object type (region|warehouse)
	* @param {Ext.data.Model} record
	*/
	onObjectsListSelected: function(cmp, type, record) {
		var rc = this.regionChooser;
		switch (type) {
			case 'warehouse':
				rc.selectObject(record.getId());
				rc.setCenter(record.get('lat'), record.get('lon'));
				break;
		}
	},

/**
	* Adds an object to the region chooser map
	* @param {Ext.data.Model} record
	* @param {Boolean} select
	*/
	regionChooserAddObject: function(type, record, select) {
		var rc = this.regionChooser;
		var list = this.getWarehouseList();
		// add objects if they not already added
		var id = record.getId();
		if (!list.getByKey(record.getId())) {
			var o = record.data;
			if (type == 'warehousemaster') {
				o.marker = C.cfg.maps.yandex.markers.FACTORY;
			}
			rc.addObject(o);
			list.add(o);
		}
		if (select) {
			rc.selectObject(id);
		} else {
			rc.deselectObject(id);
		}
	},

/**
	* Synchronizes selected regions in regions grid with regionchooser map
	*/
	syncRegions: function() {
		/*
		if (!this.regionChooserVisible) {return;}
		var checkedRegions = this.objectsList.getCheckedRegions();
		this.regionChooser.deselectAll();
		this.regionChooser.selectRegions(checkedRegions);
		*/
	},

/**
	* Window show handler
	* @private
	*/
	onShowWindow: function() {
		if (this.regionChooserVisible) {
			this.regionChooser.show();
		}
	},

/**
	* Window hide handler
	* @private
	*/
	onHideWindow: function() {
		if (this.regionChooserVisible) {
			this.btnChooseRegion.toggle();
		}
	},

/**
	* Search
	* @param {Object} cmp
	* @param {String} value
	*/
	search: function(cmp, value) {
		this.proxyStore.clearFilter();
		this.proxyStore.filterBy(function(record) {
			var re = new RegExp('^' + Ext.String.escapeRegex(value), 'i');
			return re.test(record.data.name);
		});
		this.gridProducts.getStore().load();
		this.paginator.moveFirst();
	},

/**
	* Handler of click event on UncheckAll button
	* @private
	*/
	onUncheckAllClick: function() {
		this.objectsList.uncheckAllRegions();
		this.syncRegions();
	},

/**
	* Fires when the 'pressed' state of button Map changes
	* @param {Ext.button.Button} this
	* @param {Boolean} pressed
	*/
	onChooseRegionToggle: function(button, pressed) {
		this.regionChooserVisible = pressed;

		// toggles panel
		if (this.centerPanel) {
			this.centerPanel.getLayout().setActiveItem(pressed ? 1 : 0);
		}

		if (pressed && !this.isregionChooserLoaded) {
			this.regionChooser.loadEngine();
			this.isregionChooserLoaded = true;
		}

		if (this.regionChooserVisible) {
			this.syncRegions();
		}
	},

/**
	* Selects regions in regions grid after selecting region on a map
	* @param {O.lib.panel.RegionChooser} this
	* @param {String[]} regionNames Array of region names
	*/
	onRegionChooserSelectionChange: function(panel, regions, init) {
		var diff = Ext.Array.difference(regions, this.regions),
			checked;
		if (diff.length) {
			checked = true;
		} else {
			diff = Ext.Array.difference(this.regions, regions);
			if (diff.length) {
				checked = false;
			}
		}
		if (checked !== null && !init) {
			var record = this.objectsList.getByRegionName(diff[0]);
			record.set('checked', checked);
			this.changeAmount('region', checked, record);
			this.regions = regions;
		}
	},

/**
	* Handler of click event on Reset button
	* @private
	*/
	onResetClick: function() {
		this.searchField.reset();
		var products = this.proxyStore.getRange();
		for (var i = 0, l = products.length; i < l; i++) {
			products[i].set('price', 0);
		}
		this.gridProducts.store.load();
		this.paginator.moveFirst();
	},

/**
	* Cancel button handler
	* @private
	*/
	onCancelClick: function() {
		if (this.regionChooserVisible) {
			this.btnChooseRegion.toggle();
			return;
		}
		this.hide();
	},

/**
	* Add button handler
	* @private
	*/
	onAddClick: function() {
		if (this.regionChooserVisible) {
			this.btnChooseRegion.toggle();
			return;
		}
		this.searchField.reset();
		this.gridProducts.getStore().load();
		this.paginator.moveFirst();
		var products = this.proxyStore.getRange(),
			regions = this.objectsList.getCheckedRegions(true),
			warehouses = this.objectsList.getCheckedWarehouses(),
			values = [];

		// add regions
		for (var i = 0, l = regions.length; i < l; i++) {
			var r = regions[i];
			for (var j = 0, m = products.length; j < m; j++) {
				var p = products[j].data;
				if (p.price > 0) {
					values.push({
						id_region: r.id,
						'id_region$name': r.name,
						id_product: p.id,
						'id_product$name': p.name,
						price: p.price,
						code: p.code,
						measure: p.measure,
						amount: this.feednormProxy
							.getValue(r.id, 'region', p.id).toFixed(1)
					});
				}
			}
		}

		// add warehouses
		for (var i = 0, l = warehouses.length; i < l; i++) {
			var w = warehouses[i];
			for (var j = 0, m = products.length; j < m; j++) {
				var p = products[j].data;
				if (p.price > 0) {
					values.push({
						id_warehouse: w.id,
						'id_warehouse$name': w.name,
						'id_warehouse$address': w.address,
						id_product: p.id,
						'id_product$name': p.name,
						price: p.price,
						code: p.code,
						measure: p.measure,
						amount: this.feednormProxy
							.getValue(w.id, 'warehouse', p.id).toFixed(1)
					});
				}
			}
		}

		if (Ext.isEmpty(values)) {
			var message = this.lngEmptyRegions;
			if (regions.length > 0 || warehouses.length > 0) {
				message = this.lngEmptyProducts;
			}
			O.msg.confirm({
				msg: message,
				fn: function(buttonId) {
					if (buttonId == 'yes') {
						this.fireEvent('addvalues', values);
						this.hide();
					}
				},
				scope: this
			});
		} else {
			this.fireEvent('addvalues', values);
			this.hide();
		}
	},

/**
	* After edit update price
	* @private
	*/
	onAfterEdit: function(useless, e) {
		var data = e.record.data;
		var record = this.proxyStore.getById(data.id);
		if (record) {
			record.set('price', data.price);
		}
	},

/**
	* Displays window for adding a warehouse
	* @private
	*/
	addWarehouse: function() {
		var editorWindow = this.windowCreateWarehouse;
		if (!editorWindow) {
			editorWindow = Ext.widget('dn-warehouse-editorwindow', {
				distributedOnly: true,
				width: 460
			});
			editorWindow.on('create', 'onWarehouseCreate', this);
			this.windowCreateWarehouse = editorWindow;
		}
		editorWindow.execute();
	},

/**
	* Handles warehouse creation
	* Updates ui (checks if we must disable "add warehouse" button)
	* @private
	*/
	onWarehouseCreate: function() {
		this.updateUi();
	}

});
