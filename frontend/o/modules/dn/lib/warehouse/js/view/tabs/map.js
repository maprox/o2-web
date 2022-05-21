/**
 * @class O.dn.lib.warehouse.tab.Map
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.dn.lib.warehouse.tab.Map', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.dn-warehouse-tab-map',

	bodyPadding: 0,
	defaultLatitude: 55.7539,
	defaultLongitude: 37.6236,
	defaultZoom: 7,

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Map'),
			itemId: 'map',
			iconCls: 'dn-warehouse-map',
			border: false,
			layout: 'absolute',
			items: [{
				xtype: 'baselayer_warehouse',
				anchor: '100% 100%'
			}, {
				xtype: 'panel',
				hidden: true,
				items: [{
					xtype: 'textfield',
					name: 'lat'
				}, {
					xtype: 'textfield',
					name: 'lon'
				}]
			}]
		});
		this.callParent(arguments);
		// init variables
		this.baseLayer = this.down('baselayer');
		this.fieldLat = this.getForm().findField('lat');
		this.fieldLon = this.getForm().findField('lon');
	}
});
