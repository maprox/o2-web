/**
 * @class O.lib.prodsupply.offer.AddPriceWindow
 * @extends O.ui.Window
 */
C.define('O.lib.prodsupply.offer.AddPriceWindow', {
	extend: 'O.ui.Window',
	alias: 'widget.dnofferwindow',

/** Translated fields */
	lngEmptyProducts: 'You did not choose any products.<br/>' +
		'No data will be added to your offer.<br/>' +
		'Are you shure you want to close this window?',
	lngEmptyRegions: 'You did not choose any regions.<br/>' +
		'No data will be added to your offer.<br/>' +
		'Are you shure you want to close this window?',

	regions: [],

/**
	* @constructor
	*/
	initComponent: function() {
		// editor plugin
		this.editor = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		})

		var data = [],
			records = C.getStore('dn_product').getRange();
		for (var i = 0, l = records.length; i < l; i++) {
			data.push(records[i].data);
		}

		this.proxyStore = Ext.create('Ext.data.Store', {
			storeId: 'dnofferproduct',
			model: 'Dn.Product',
			data: data,
			autoSync: true,
			proxy: {
				type: 'memory'
			}
		});

		var storeProducts = Ext.create('Ext.data.Store', {
			autoLoad: true,
			model: 'Dn.Product',
			autoSync: true,
			proxy: new O.proxy.Store({
				storeId: 'dnofferproduct'
			})
		});

		this.feednormProxy = O.manager.Model.getProxy('dn_feednorm_value');
		//this.feednormProxy.getStore();

		this.gridProducts = Ext.create('Ext.grid.Panel', {
			store: storeProducts,
			columns: {
				defaults: {
					sortable: false
				},
				items: [{
					header: _('Code'),
					dataIndex: 'code',
					width: 150
				}, {
					header: _('Name'),
					dataIndex: 'name',
					flex: 1
				}, {
					header: _('Amount'),
					dataIndex: 'amount',
					width: 80
				}, {
					header: _('Measure'),
					dataIndex: 'measure',
					width: 80
				}, {
					header: _('Price'),
					dataIndex: 'price',
					width: 80,
					field: {
						allowBlank: true,
						maskRe: /[\d\.-]/
					}/*,
					renderer: function(value) {
						return value || '';
					}*/
				}]
			},
			dockedItems: [{
				dock: 'top',
				xtype: 'toolbar',
				items: [{
					xtype: 'button',
					itemId: 'reset',
					text: _('Reset'),
					iconCls: 'offers_reset'
				}, {
					xtype: 'tbseparator'
				}, {
					xtype: 'textfield',
					fieldLabel: _('Search'),
					labelWidth: 60,
					itemId: 'search'
				}]
			}, {
				dock: 'bottom',
				xtype: 'pagingtoolbar',
				displayInfo: true,
				store: storeProducts,
				itemId: 'paging'
			}],
			plugins: [
				this.editor
			]
		});

		Ext.apply(this, {
			title: _('Adding product prices'),
			hidden: true,
			modal: true,
			layout: 'border',
			items: [{
				xtype: 'offerobjectslist',
				width: 230,
				split: true,
				region: 'west',
				dockedItems: [{
					dock: 'top',
					xtype: 'toolbar',
					items: [{
						text: _('Add warehouse'),
						iconCls: 'offers_add',
						itemId: 'btn_addwarehouse'
					}, {
						xtype: 'tbfill'
					}, {
						xtype: 'button',
						itemId: 'btn_showmap',
						text: _('Map'),
						iconCls: 'offers_map',
						enableToggle: true
					}]
				}]
			}, {
				region: 'center',
				layout: 'card',
				itemId: 'centercards',
				border: false,
				items: [
					this.gridProducts,
				{
					title: null,
					xtype: 'regionchooser',
					showPanelTitles: false,
					showListPanel: false,
					loadEngineOnRender: false
				}]
			}],
			dockedItems: [{
				dock: 'bottom',
				xtype: 'toolbar',
				ui: 'footer',
				items: [{
					xtype: 'tbfill'
				}, {
					text: _('Add'),
					iconCls: 'offers_add',
					itemId: 'add'
				}, {
					text: _('Cancel'),
					iconCls: 'offers_cancel',
					itemId: 'cancel'
				}]
			}]
		});
		this.callParent(arguments);

		// init component links
		this.regionChooser = this.down('regionchooser');
		this.objectsList = this.down('offerobjectslist');
		this.btnChooseRegion = this.down('#btn_showmap');
		this.btnAddWarehouse = this.down('#btn_addwarehouse');
		this.btnReset = this.down('#reset');
		this.btnCancel = this.down('#cancel');
		this.btnAdd = this.down('#add');
		this.searchField = this.down('#search');
		this.paginator = this.down('#paging');
		this.centerPanel = this.down('#centercards');
	}
});
