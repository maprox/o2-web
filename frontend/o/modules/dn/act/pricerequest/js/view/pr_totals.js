/**
 *
 * @class O.dn.act.pricerequest.Totals
 * @extends C.ui.Panel
 */
C.define('O.dn.act.pricerequest.Totals', {
	extend: 'C.ui.Panel',
	alias: 'widget.pricesrequest_totals',

	disabled: true,

/**
	* Component initialization
	*/
	initComponent: function() {
		this.store = new Ext.data.Store({
			fields: [
				{name: 'id', type: 'string'},
				{name: 'product', type: 'string'},
				{name: 'place', type: 'string'},
				{name: 'amount', type: 'float', useNull: true},
				{name: 's1', type: 'string'},
				{name: 's1price', type: 'float', useNull: true},
				{name: 's2', type: 'string'},
				{name: 's2price', type: 'float', useNull: true},
				{name: 's3', type: 'string'},
				{name: 's3price', type: 'float', useNull: true}
			],
			data: []
		});
		Ext.apply(this, {
			title: _('Tender totals'),
			itemId: 'tender-totals',
			iconCls: 'dn-tender-totals',
			bodyPadding: 0,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			defaults: {
				xtype: 'gridpanel',
				border: false,
				columnLines: true,
				flex: 1,
				viewConfig: {
					stripeRows: true
				}
			},
			items: [{
				title: _('Distribution by places'),
				itemId: 'gridDistribution',
				store: this.store,
				split: true,
				columns: {
					defaults: {
						menuDisabled: true,
						groupable: false,
						sortable: false,
						flex: 1
					},
					items: [{
						header: _('Product'),
						dataIndex: 'product',
						menuDisabled: false,
						sortable: true,
						groupable: true
					}, {
						header: _('Region') + ' / ' + _('Warehouse'),
						dataIndex: 'place',
						menuDisabled: false,
						sortable: true,
						groupable: true
					}, {
						header: _('Amount'),
						dataIndex: 'amount',
						hidden: true,
						align: 'right',
						width: 100,
						flex: null
					}, {
						header: _('1st place'),
						dataIndex: 's1'
					}, {
						header: _('Price'),
						dataIndex: 's1price',
						align: 'right',
						width: 100,
						flex: null
					}, {
						header: _('2nd place'),
						dataIndex: 's2'
					}, {
						header: _('Price'),
						dataIndex: 's2price',
						align: 'right',
						width: 100,
						flex: null
					}, {
						header: _('3rd place'),
						dataIndex: 's3'
					}, {
						header: _('Price'),
						dataIndex: 's3price',
						align: 'right',
						width: 100,
						flex: null
					}]
				},
				features: [{
					ftype: 'groupingsummary',
					groupHeaderTpl: '{name} ({rows.length})'
				}]
			}, {
				xtype: 'splitter',
				flex: null
			}, {
				title: _('Tender totals'),
				itemId: 'gridTotals',
				store: this.store,
				columns: {
					defaults: {
						menuDisabled: true,
						groupable: false,
						sortable: false,
						flex: 1
					},
					items: [{
						header: _('Product'),
						dataIndex: 'product',
						menuDisabled: false,
						sortable: true,
						groupable: true
					}, {
						header: _('Region') + ' / ' + _('Warehouse'),
						dataIndex: 'place',
						menuDisabled: false,
						sortable: true,
						groupable: true
					}, {
						header: _('Winner'),
						dataIndex: 's1'
					}, {
						header: _('Price'),
						dataIndex: 's1price',
						align: 'right',
						width: 100,
						flex: null
					}]
				},
				features: [{
					ftype: 'groupingsummary',
					groupHeaderTpl: '{name} ({rows.length})'
				}]
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'button',
					itemId: 'btnExport',
					iconCls: 'btn-export',
					text: _('Export')
				}, {
					xtype: 'button',
					itemId: 'btnTotals',
					enableToggle: true,
					pressed: false,
					iconCls: 'btn-totals',
					text: _('Totals')
				}]
			}]
		});
		this.callParent(arguments);
		// init variables
		this.gridDistribution = this.down('#gridDistribution');
		this.gridTotals = this.down('#gridTotals');
		this.btnExport = this.down('#btnExport');
		this.btnTotals = this.down('#btnTotals');
	}

});
