/**
 *
 * @class O.comp.ZonesTabMap
 * @extends O.common.lib.modelslist.Tab
 */

C.define('O.mon.geofence.tab.Map', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.mon-geofence-tab-map',

	border: false,
	bodyPadding: 0,
	defaultLatitude: 55.7539,
	defaultLongitude: 37.6236,
	defaultZoom: 7,
	itemId: 'map',
	iconCls: 'map',

/**
	* False to allow save geofence without coordinates
	* @type Boolean
	*/
	notEmptyPoints: false,

/**
	* @constructor
	*/
	initComponent: function() {
		var geozonePanelConfig = {
			xtype: 'geozonepanel',
			notEmptyPoints: this.notEmptyPoints,
			autoScroll: true,
			toFrontOnShow: true,
			showButtons: false,
			border: false,
			width: 300,
			split: true
		};
		if (this.geozonePanelConfig) {
			Ext.apply(geozonePanelConfig, this.geozonePanelConfig);
		}
		this.geozonePanel = Ext.widget(geozonePanelConfig);
		Ext.apply(this, {
			title: _('Map'),
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [this.geozonePanel, {
				xtype: 'baselayer_geofence',
				bodyPadding: 10,
				flex: 1
			}]
		});
		this.callParent(arguments);
		// init variables
		this.geozonePanel = this.down('geozonepanel');
		this.baseLayer = this.down('baselayer');

		this.geozonePanel.insert(5, {
			xtype: 'checkbox',
			inputValue: '1',
			uncheckedValue: '0',
			labelAlign: 'left',
			fieldLabel: _('Garage'),
			name: 'is_garage'
		});
	}
});
