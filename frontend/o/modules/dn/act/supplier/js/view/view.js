/**
 *
 * Suppliers list panel
 * @class O.act.panel.dn.SupplierList
 * @extends C.ui.Panel
 */
C.define('O.act.panel.dn.SupplierView', {
	extend: 'C.ui.Panel',
	alias: 'widget.dn_supplier_view',

/** Language specific */
	title: 'Supplier information',

/**
	* @constructs
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'otabpanel',
				items: [{
					xtype: 'dn_supplier_info',
					itemId: 'info'
				}, {
					xtype: 'dn_supplier_docs',
					itemId: 'docs'
				}]
			}]
		});
		this.callParent(arguments);
		this.tabInfo = this.down('#info');
		this.tabDocs = this.down('#docs');
	}
});
