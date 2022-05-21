/**
 *
 * Supplier documents
 * @class O.act.panel.dn.SupplierDocs
 * @extends C.ui.Panel
 */
C.define('O.act.panel.dn.SupplierDocs', {
	extend: 'C.ui.Panel',
	alias: 'widget.dn_supplier_docs',

/** Language specific */
	lngWaitMsg: 'Please wait...',
	lngMsgUploaded: 'Document successfully uploaded',
	lngMsgRemoveTitle: 'Remove document?',
	lngMsgRemoveText: 'You really want to remove document?',
	lngMsgRemoved: 'Document successfully removed',

/**
	* @constructs
	*/
	initComponent: function() {
		var me = this;
		Ext.apply(this, {
			title: _('Documents'),
			itemId: 'docs',
			layout: 'border',
			defaults: {
				border: false
			},
			border: false,
			items: [{
				region: 'center',
				xtype: 'gridpanel',
				itemId: 'documentsGrid',
				flex: 1,
				store: C.getStore('dn_doc'),
				columns: [{
					header: _('Date'),
					dataIndex: 'dt',
					width: 130
				}, {
					header: _('File'),
					dataIndex: 'file',
					width: 200
				}, {
					header: _('Name'),
					dataIndex: 'name',
					flex: 1
				}]
			}, {
				region: 'south',
				xtype: 'xuploadpanel',
				itemId: 'uploadPanel',
				title: _('Upload files'),
				minHeight: 160,
				flex: 1,
				split: true
			}],
			dockedItems: [{
				dock: 'top',
				xtype: 'toolbar',
				items: [{
					itemId: 'btnRemove',
					text: _('Remove'),
					iconCls: 'btn_dn_supplier_recyclebin'
				}, {
					itemId: 'btnDownload',
					text: _('Download'),
					iconCls: 'btn_dn_supplier_download'
				}]
			}]
		});
		this.callParent(arguments);

		// init variable links
		this.documentsGrid = this.down('#documentsGrid');
		this.store = this.documentsGrid.getStore();
		this.uploadPanel = this.down('#uploadPanel');
		this.btnDownload = this.down('#btnDownload');
		this.btnRemove = this.down('#btnRemove');
	}
});
