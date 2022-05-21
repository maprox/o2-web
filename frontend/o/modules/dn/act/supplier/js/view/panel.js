/**
 *
 * Suppliers list panel
 * @class O.act.panel.dn.Supplier
 * @extends C.ui.Panel
 */
C.define('O.act.panel.dn.Supplier', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_dn_supplier',

/**
	* @constructs
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'border',
			items: [{
				region: 'west',
				xtype: 'dn_supplier_list',
				flex: 1,
				split: true
			}, {
				region: 'center',
				xtype: 'dn_supplier_view',
				flex: 4
			}]
		});
		this.callParent(arguments);
		this.supplierList = this.down('dn_supplier_list');
		this.supplierView = this.down('dn_supplier_view');
	}
});
