/**
 *
 * @class O.dn.act.priceresponse.Editor
 * @extends C.ui.Panel
 */
C.define('O.dn.act.priceresponse.EditorList', {
	extend: 'C.ui.Panel',
	alias: 'widget.pricesresponse_editorlist',

/**
	* Column names
	*/
	colWarehouse: 'Warehouse',
	colAddress: 'Address',

/**
	* Component initialization
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'grid',
				store: 'pricesResponseList',

				columns: [{
					text: this.colWarehouse,
					dataIndex: 'id_place',
					renderer: O.convert.warehouse,
					flex: 2
				}, {
					text: this.colAddress,
					dataIndex: 'id_place',
					renderer: O.convert.warehouseAddress,
					flex: 5
				}],
				selType: 'rowmodel',
				plugins: []
			}]
		});

		this.callParent(arguments);
	}

});
