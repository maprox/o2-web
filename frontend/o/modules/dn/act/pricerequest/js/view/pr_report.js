/**
 *
 * @class O.dn.act.pricerequest.Report
 * @extends C.ui.Panel
 */
C.define('O.dn.act.pricerequest.Report', {
	extend: 'C.ui.Panel',
	alias: 'widget.pricesrequest_report',

	disabled: true,

/**
	* Component initialization
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Consolidated report'),
			itemId: 'tender-report',
			iconCls: 'dn-tender-report',
			bodyPadding: 0,
			layout: 'fit',
			items: [{
				xtype: 'gridpanel',
				border: false,
				columnLines: true,
				enableLocking: true,
				store: new Ext.data.Store({
					fields: ['name'],
					data: []
				}),
				columns: [{
					dataIndex: 'name'
				}],
				viewConfig: {
					stripeRows: true
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
				}, {
					xtype: 'tbfill'
				}, {
					xtype: 'button',
					itemId: 'btnGroupRegion',
					text: _('By region'),
					iconCls: 'offers_group',
					toggleGroup: 'offer_group'
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
					toggleGroup: 'offer_group',
					pressed: true
				}/*, {
					xtype: 'button',
					itemId: 'btnSwap',
					iconCls: 'btn-swap',
					text: _('Swap columns')
				}*/]
			}]
		});
		this.callParent(arguments);
		// init variables
		this.grid = this.down('gridpanel');
		this.btnExport = this.down('#btnExport');
		this.btnTotals = this.down('#btnTotals');
		this.btnGroupRegion = this.down('#btnGroupRegion'),
		this.btnGroupProduct = this.down('#btnGroupProduct'),
		this.btnGroupOff = this.down('#btnGroupOff');
		this.btnSwap = this.down('#btnSwap');
	}

});
