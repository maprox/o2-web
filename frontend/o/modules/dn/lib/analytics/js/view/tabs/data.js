/**
 * @class O.dn.lib.analytics.tab.Data
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.dn.lib.analytics.tab.Data', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.dn-analytics-tab-data',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Data'),
			itemId: 'report-data',
			iconCls: 'dn-analytics-data',
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
					ftype: 'grouping',
					groupHeaderTpl: '{name} ({rows.length})'
				}]
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'button',
					itemId: 'btnReload',
					iconCls: 'btn-reload',
					text: _('Reload data')
				}, {
					xtype: 'button',
					itemId: 'btnExport',
					iconCls: 'btn-export',
					text: _('Export')
				}, {
					xtype: 'tbfill'
				}, {
					xtype: 'button',
					itemId: 'btnSwap',
					iconCls: 'btn-swap',
					text: _('Swap columns')
				}]
			}]
		});
		this.callParent(arguments);
		// init variables
		this.grid = this.down('gridpanel');
		this.btnReload = this.down('#btnReload');
		this.btnExport = this.down('#btnExport');
		this.btnSwap = this.down('#btnSwap');
	}
});
