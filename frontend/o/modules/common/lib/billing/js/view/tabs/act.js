/**
 * @class O.lib.billing.tab.Act
 * @extends Ext.panel.Panel
 */
C.define('O.lib.billing.tab.Act', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.common-tariff-tab-act',
	itemId: 'acts',

/**
	* @construct
	*/
	initComponent: function() {
		this.gridStore = Ext.create('O.common.lib.billing.data.Act');
		/*this.gridStore = Ext.create('Ext.data.Store', {
			model: 'Dn.Act',
			autoLoad: false,
			remoteSort: true,
			proxy: {
				type: 'rest',
				url: '/dn_act',
				reader: {
					type: 'json',
					root: 'data',
					totalProperty: 'count'
				},
				writer: {
					type: 'json',
					writeAllFields: true,
					root: 'data'
				},
				extraParams: {}
			},
			sortOnLoad: true,
			sorters: {
				property: 'dt',
				direction : 'DESC'
			}
		});*/

		Ext.apply(this, {
			title: _('Acts'),
			iconCls: 'billing_act',
			layout: 'fit',
			items: [{
				xtype: 'gridpanel',
				store: this.gridStore,
				border: false,
				columnLines: false,
				columns: {
					defaults: {
						fixed: true,
						menuDisabled: true
					},
					items: [{
						header: _('Act #'),
						dataIndex: 'num',
						width: 200
					}, {
						header: _('Date'),
						dataIndex: 'dt',
						renderer: Ext.util.Format.localDate,
						width: 120
					}]
				},
				trackMouseOver: false,
				enableColumnResize: false,
				dockedItems: [{
					xtype: 'pagingtoolbar',
					store: this.gridStore,
					dock: 'bottom',
					displayInfo: true
				}, {
					xtype: 'toolbar',
					layout: 'hbox',
					items: [{
						xtype: 'button',
						itemId: 'btnCreate',
						iconCls: 'btn-create',
						text: _('Create')
					}, {
						xtype: 'button',
						itemId: 'btnPrint',
						iconCls: 'btn-print',
						text: _('Print')
					}, {
						xtype: 'tbfill'
					}, {
						xtype: 'button',
						itemId: 'btnDelete',
						iconCls: 'btn-delete',
						text: _('Delete')
					}]
				}]
			}]
		});

		this.callParent(arguments);
		// assign variables
		this.grid = this.down('gridpanel');
		this.btnPrint = this.down('#btnPrint');
		this.btnCreate = this.down('#btnCreate');
		this.btnDelete = this.down('#btnDelete');
	}

});
