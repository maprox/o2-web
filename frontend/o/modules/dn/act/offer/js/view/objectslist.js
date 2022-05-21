/**
   @copyright  2012, Maprox LLC <http://maprox.net>

   @author     Alexander Lyapko <sunsay@maprox.net>
   @author     Anton Grinin <agrinin@maprox.net>
   @author     Konstantin Pakshaev <kpakshaev@maprox.net>
*/

/**
 * List for selection regions / warehouses
 * @class O.lib.prodsupply.offer.ObjectsList
 * @extends C.ui.Panel
 */
C.define('O.lib.prodsupply.offer.ObjectsList', {
	extend: 'C.ui.Panel',
	alias: 'widget.offerobjectslist',

	border: true,

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			defaults: {
				xtype: 'grid',
				enableColumnResize: false,
				enableColumnMove: false,
				border: false,
				flex: 1
			},
			items: [{
				itemId: 'clientwarehousegrid',
				store: C.getStore('dn_warehouse'),
				columns: {
					defaults: {
						menuDisabled: true,
						sortable: false
					},
					items: [{
						xtype: 'checkcolumn',
						dataIndex: 'checked',
						width: 28,
						editor: {
							xtype: 'checkbox',
							cls: 'x-grid-checkheader-editor'
						}
					}, {
						header: _('My warehouses'),
						dataIndex: 'name',
						flex: 1
					}]
				}
			}, {
				itemId: 'masterwarehousegrid',
				store: C.getStore('dn_warehouse_list'),
				columns: {
					defaults: {
						menuDisabled: true,
						sortable: false
					},
					items: [{
						xtype: 'checkcolumn',
						dataIndex: 'checked',
						width: 28,
						editor: {
							xtype: 'checkbox',
							cls: 'x-grid-checkheader-editor'
						}
					}, {
						header: _('Distribution centers'),
						dataIndex: 'name',
						flex: 1
					}]
				}
			}, {
				itemId: 'regionsgrid',
				flex: 2,
				store: C.getStore('dn_region'),
				columns: {
					defaults: {
						menuDisabled: true,
						sortable: false
					},
					items: [{
						xtype: 'checkcolumn',
						dataIndex: 'checked',
						width: 28,
						editor: {
							xtype: 'checkbox',
							cls: 'x-grid-checkheader-editor'
						}
					}, {
						header: _('Region'),
						dataIndex: 'name',
						flex: 1
					}]
				},
				viewConfig: {
					getRowClass: function(record) {
						if (record.data.important) {
							return 'offer_important';
						}
					}
				}
			}]
		});
		this.callParent(arguments);
		this.gridRegions = this.down('#regionsgrid');
		this.gridClientWarehouse = this.down('#clientwarehousegrid');
		this.gridMasterWarehouse = this.down('#masterwarehousegrid');
	}
});