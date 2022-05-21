/**
 * @class O.lib.prodsupply.offer.Tabs
 * @extends Ext.grid.Panel
 */
C.define('O.lib.prodsupply.offer.Tabs', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.dnoffertabs',

/** Props */
	border: false,
	disabled: true,
	layout: {
		type: 'fit',
		align: 'stretch'
	},

/**
	* @constructor
	*/
	initComponent: function() {
		this.editor = Ext.createByAlias('plugin.cellediting', {
			clicksToEdit: 1
		});
		this.offerEditorWindow = Ext.widget('dnofferwindow');
		Ext.apply(this, {
			store: Ext.create('Ext.data.Store', {
				autoLoad: false,
				model: 'Dn.OfferValue',
				groupField: 'id_region$name'
			}),
			features: [{
				ftype:'grouping',
				groupHeaderTpl: '{name} ({rows.length})'
			}],
			plugins: [
				this.editor
			],
			columns: {
				defaults: {
					groupable: false
				},
				items: [{
					itemId: 'colRegion',
					header: _('Region'),
					dataIndex: 'id_region$name',
					flex: 1,
					hidden: true
				}, {
					itemId: 'colWarehouse',
					header: _('Warehouse'),
					dataIndex: 'id_warehouse$name',
					flex: 1
				},  {
					itemId: 'colAddress',
					header: _('Address'),
					dataIndex: 'id_warehouse$address',
					flex: 1
				}, {
					itemId: 'colCode',
					header: _('Code'),
					dataIndex: 'code',
					width: 150
				}, {
					itemId: 'colProduct',
					header: _('Name'),
					dataIndex: 'id_product$name',
					flex: 2
				}, {
					itemId: 'colAmount',
					xtype: 'numbercolumn',
					header: _('Amount'),
					formta: '0.00',
					dataIndex: 'amount',
					flex: 1
				}, {
					itemId: 'colMeasure',
					header: _('Measure'),
					dataIndex: 'measure',
					flex: 1
				}, {
					itemId: 'colPrice',
					header: _('Price'),
					dataIndex: 'price',
					width: 80,
					field: {
						allowBlank: false
					}
				}]
			},
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				enableOverflow: true,
				items: [{
					xtype: 'button',
					itemId: 'btnAddValues',
					text: _('Add'),
					iconCls: 'offers_add'
				}, {
					xtype: 'button',
					itemId: 'btnRemoveValue',
					text: _('Remove'),
					iconCls: 'offers_remove'
				}, {
					xtype: 'button',
					itemId: 'btnSave',
					text: _('Save'),
					iconCls: 'save',
					disabled: true
				}, {
					xtype: 'button',
					itemId: 'btnReset',
					text: _('Reset'),
					iconCls: 'offers_reset',
					disabled: true
				}, {
					xtype: 'tbfill'
				}, {
					xtype: 'button',
					itemId: 'btnGroupRegion',
					text: _('By region'),
					iconCls: 'offers_group',
					toggleGroup: 'offer_group',
					pressed: true
				}, {
					xtype: 'button',
					itemId: 'btnGroupProduct',
					text: _('By product'),
					iconCls: 'offers_group',
					toggleGroup: 'offer_group'
				}, {
					xtype: 'button',
					itemId: 'btnGroupOff',
					text: _('Without grouping'),
					iconCls: 'offers_group_off',
					toggleGroup: 'offer_group'
				}]
			}]
		});
		this.callParent(arguments);

		// init compoment links
		this.btnAddValues = this.down('#btnAddValues'),
		this.btnRemoveValue = this.down('#btnRemoveValue'),
		this.btnSave = this.down('#btnSave'),
		this.btnReset = this.down('#btnReset'),
		this.btnGroupRegion = this.down('#btnGroupRegion'),
		this.btnGroupProduct = this.down('#btnGroupProduct'),
		this.btnGroupOff = this.down('#btnGroupOff');
		this.colAmount = this.down('#colAmount');
	}
});