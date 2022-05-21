/**
 * @class O.lib.billing.tab.Invoice
 * @extends Ext.panel.Panel
 */
C.define('O.lib.billing.tab.Invoice', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.common-tariff-tab-invoice',
	itemId: 'invoices',

/**
	* True if user is allowed to confirm payments
	* @cfg {String}
	*/
	payConfirmationEnabled: false,

/**
	* @constructs
	*/
	msgConfirmation: 'Confirmation',
	msgAskDelete: 'Do you realy want to delete selected billing invoice?',

	initComponent: function() {

		this.gridStore = Ext.create('storeBillingInvoice');
		/*this.gridStore.getProxy().extraParams = {
			'$filter': 'edt gt now'
		};*/
		/*this.gridStore = Ext.create('Ext.data.Store', {
			model: 'modelBillingInvoice',
			autoLoad: false,
			remoteSort: true,
			proxy: {
				type: 'rest',
				url: '/billing_invoice',
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
				extraParams: {
					'$filter': 'edt gt now'
				}
			},
			sortOnLoad: true,
			sorters: {
				property: 'sdt',
				direction : 'DESC'
			}
		});*/

		/** Action buttons */
		this.printButton = Ext.create('Ext.button.Button', {
			iconCls: 'i-print',
			text: _('Print'),
			disabled: true,
			hidden: true,
			handler: this.printInvoice,
			scope: this
		});

		this.doButton = Ext.create('Ext.button.Button', {
			iconCls: 'i-do',
			text: _('Pay'),
			disabled: true,
			handler: this.activateInvoice,
			scope: this
		});

		this.cancelButton = Ext.create('Ext.button.Button', {
			iconCls: 'i-cancel',
			text: _('Cancel request'),
			disabled: true,
			handler: this.deleteInvoice,
			scope: this
		});

		this.paidButton = Ext.create('Ext.button.Button', {
			iconCls: 'i-paid',
			text: _('Was paid'),
			hidden: true,
			handler: this.labelPaidInvoice,
			scope: this
		});

		/** Main layout */
		Ext.apply(this, {
			title: _('Invoices'),
			iconCls: 'billing_invoice',
			layout: 'fit',
			items: [{
				xtype: 'gridpanel',
				store: this.gridStore,
				border: false,
				columnLines: false,
				columns: [{
					header: _('Invoice #'),
					dataIndex: 'id',
					flex: 1,
					fixed: true
				}, {
					header: _('Date'),
					dataIndex: 'sdt',
					flex: 2,
					fixed: true,
					renderer: Ext.util.Format.localTimestamp
				}, {
					header: _('Status'),
					dataIndex: 'status',
					flex: 4,
					fixed: true,
					renderer: function(value) {
						value = value - 0;
						return _('invoiceStatus' + value);
					}
				}, {
					header: _('Payment type'),
					dataIndex: 'id_payment_type',
					flex: 4,
					fixed: true,
					renderer: function(value) {

						var store = C.getStore('billing_payment_type'),
							record = store.getAt(store.find('id', value));

						if (!record) {
							return '';
						}

						return record.get('name');
					}
				}, {
					header: _('Sum'),
					dataIndex: 'amount',
					flex: 2,
					renderer: Ext.util.Format.ruMoney,
					align: 'right',
					fixed: true
				}, {
					header: _('Payment date'),
					dataIndex: 'paydt',
					flex: 2,
					fixed: true,
					renderer: Ext.util.Format.localDate
				}],
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
					items: [
						this.cancelButton,
						this.doButton,
						this.printButton,
						this.paidButton
					]
				}]
			}]
		});
		this.callParent(arguments);
		// assign variables
		this.grid = this.down('gridpanel');
		this.toolbar = this.grid.down('pagingtoolbar');
	}

});
