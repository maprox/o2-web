/**
 * @fileOverview Класс окна мониторинга объектов
 * В центре окна располагается карта перемещения (Google, Yandex, etc.).
 * Слева (или справа) список групп устройств, которые можно включать/выключать
 *
 * @class O.map.Panel
 * @extends C.ui.Panel
 */
C.define('O.map.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_map',

/**
	 * Hide objects list
	 */
	hideObjectsPanel: false,

/**
	 * Hide toolbar
	 */
	hideToolbar: false,

/**
	 * xtype for baselayer
 	 */
	baseLayerType: 'baselayer_map',

/**
	* Component initialization
	*/
	initComponent: function() {
		// geofence create panel is hidden
		Ext.apply(this, {
			layout: 'border',
			dockedItems: [{
				xtype: 'toolbar',
				hidden: this.hideToolbar,
				dock: 'top',
				items: [{
					itemId: 'createZone',
					iconCls: 'btnzoneditor',
					xtype: 'button',
					enableToggle: true,
					text: _('Create geofence')
				}, {
					itemId: 'followSelected',
					iconCls: 'btnfollow',
					xtype: 'button',
					stateId: 'map_followSelected',
					stateful: true,
					stateEvents: ['toggle'],
					getState: function() {
						return {
							pressed: this.pressed
						}
					},
					enableToggle: true,
					text: _('Follow selected')
				}, {
					itemId: 'showLastPoints',
					iconCls: 'btnshowtrack',
					xtype: 'button',
					stateId: 'map_showLastPoints',
					stateful: true,
					stateEvents: ['toggle'],
					getState: function() {
						return {
							pressed: this.pressed
						}
					},
					enableToggle: true,
					pressed: true,
					text: _('Show last points')
				}, {
					itemId: 'showDeviceLabels',
					iconCls: 'btnshowlabels',
					xtype: 'button',
					stateId: 'map_showDeviceLabels',
					stateful: true,
					stateEvents: ['toggle'],
					getState: function() {
						return {
							pressed: this.pressed
						}
					},
					enableToggle: true,
					text: _('Show labels')
				}]
			}],
			items: [{
				border: false,
				region: 'center',
				itemId: 'mapRegion',
				layout: 'absolute',
				items: [{
					anchor: '100% 100%',
					xtype: this.baseLayerType
				}, {
					x: 8, y: 8,
					width: 400,
					preventHeader: false,
					toFrontOnShow: true,
					xtype: 'geozonepanel',
					itemId: 'geozonepanel'
				}]
			}, {
				xtype: 'panel',
				region: 'west',
				hidden: this.hideObjectsPanel,
				width: 400,
				split: true,
				collapsible: true,
				animCollapse: false,
				title: _('List of objects'),
				stateId: 'map_objectspanel',
				stateful: true,
				layout: 'border',
				items: [{
					border: false,
					region: 'center',
					xtype: 'objectsgroupslist',
					multiSelectObjects: true
				}, {
					xtype: 'mappanel',
					stateId: 'map_historypanel',
					stateEvents: ['resize'],
					split: true,
					height: 400,
					region: 'south'
				}]
			}]
		});
		this.callParent(arguments);
		// init variable links
		this.mapBaseLayer = this.down('baselayer');
		this.geozonePanel = this.down('geozonepanel');
		this.groupsList = this.down('objectsgroupslist');
		this.mapRegion = this.down('#mapRegion');
		// buttons
		this.btnCreateZone = this.down('#createZone');
		this.btnToggleFollow = this.down('#followSelected');
		this.btnToggleShowTrack = this.down('#showLastPoints');
		this.btnToggleShowLabels = this.down('#showDeviceLabels');
	}
});
