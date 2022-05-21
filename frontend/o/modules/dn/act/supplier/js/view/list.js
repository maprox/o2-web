/**
 *
 * Suppliers list panel
 * @class O.act.panel.dn.SupplierList
 * @extends C.ui.Panel
 */
C.define('O.act.panel.dn.SupplierList', {
	extend: 'C.ui.Panel',
	alias: 'widget.dn_supplier_list',

/** Language specific */
	title: 'Suppliers list',
	colRegDate: 'Registration',
	colCompanyName: 'Company',
	colStatus: 'Status',
	lngEmptyGrid: 'No accounts found',
	lngBtnActivate: 'Activate',
	lngBtnRemove: 'Remove',
	lngBtnRestore: 'Restore',
	lngBtnTrashed: 'Show trashed',
	lngAskRemove: 'Are you shure you want to delete selected supplier?',
	lngAskRestore: 'Are you shure you want to restore selected supplier?',
	lngAskActivate: 'Are you shure you want to activate selected supplier?',
	lngActionDone: {
		remove: 'Supplier account is successfully deleted',
		restore: 'Supplier account is successfully restored',
		activate: 'Supplier account is successfully activated',
		disable: 'Supplier account is successfully disabled',
		enable: 'Supplier account is successfully enabled'
	},

/**
	* Constants
	* @type Number
	*/
	STATUS_INACTIVE: 0,
	STATUS_ACTIVE: 1,
	STATUS_DISABLED: 2,
	STATUS_TRASHED: 3,

	loadTrashed: false,

/**
	* @constructs
	*/
	initComponent: function() {
		var me = this;
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'gridpanel',
				store: 'storeSupplierAccount',
				border: false,
				columnLines: false,
				columns: [{
					header: this.colRegDate,
					dataIndex: 'dt_request',
					width: 80,
					fixed: true,
					xtype: 'datecolumn',
					format: 'd.m.Y'
				}, {
					header: this.colCompanyName,
					dataIndex: 'firmname',
					flex: 1
				}, {
					header: this.colStatus,
					dataIndex: 'statusname',
					width: 80
				}],
				viewConfig: {
					emptyText: this.lngEmptyGrid,
					getRowClass: function(record) {
						var status = record.get('state');
						return status == me.STATUS_INACTIVE ?
							'inactive' : status == me.STATUS_TRASHED ?
							'trashed' : status == me.STATUS_DISABLED ?
							'disabled' : record.get('has_docs') ?
							'has_docs' : '';
					}
				},
				trackMouseOver: false,
				enableColumnResize: false,
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					enableOverflow: true,
					items: [{
						itemId: 'btnTrashed',
						text: this.lngBtnTrashed,
						iconCls: 'btn_dn_supplier_trashed',
						enableToggle: true,
						pressed: this.loadTrashed
					}, {
						itemId: 'btnActivate',
						text: this.lngBtnActivate,
						iconCls: 'btn_dn_supplier_activate'
					}, {
						xtype: 'tbfill'
					}, {
						itemId: 'btnRestore',
						text: this.lngBtnRestore,
						iconCls: 'btn_dn_supplier_restore'
					}, {
						itemId: 'btnRemove',
						text: this.lngBtnRemove,
						iconCls: 'btn_dn_supplier_recyclebin'
					}]
				}, {
					xtype: 'toolbar',
					dock: 'bottom',
					enableOverflow: true,
					items: [{
						arrowAlign: 'right',
						text: _('Export list'),
						menu: [{
							action: 'export-suppliers',
							text: _('PDF'),
							iconCls: 'fmt-pdf',
							outputFormat: 'PDF'
						}, {
							action: 'export-suppliers',
							text: _('Excel'),
							iconCls: 'fmt-xls',
							outputFormat: 'XLS'
						}, {
							action: 'export-suppliers-elma',
							text: _('Excel (Elma)'),
							iconCls: 'fmt-xls',
							outputFormat: 'XLS'
						}]
					}, {
						itemId: 'btnMailing',
						text: _('Mailing')
					}]
				}]
			}]
		});
		this.callParent(arguments);
		// set component access variables
		this.grid = this.down('gridpanel');
		this.gridStore = this.grid.getStore();
		this.btnActivate = this.down('#btnActivate');
		this.btnRemove = this.down('#btnRemove');
		this.btnTrashed = this.down('#btnTrashed');
		this.btnRestore = this.down('#btnRestore');
		this.btnMailing = this.down('#btnMailing');
	}
});
