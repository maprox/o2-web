/**
 * @class O.mon.act.dashboard.Panel
 * @extends C.ui.Panel
 */
C.define('O.mon.act.dashboard.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.mon-dashboard',

/**
	 * Get tools
	 */
	getTools: function(){
		return [{
			xtype: 'tool',
			type: 'gear',
			handler: function(e, target, header, tool){
				var portlet = header.ownerCt;
				portlet.setLoading('Loading...');
				Ext.defer(function() {
					portlet.setLoading(false);
				}, 2000);
			}
		}];
	},

	/**
	 * @constructor
	 */
	initComponent: function() {

		var content = '<div class="portlet-content">'
		+ 'Lorem ipsum dolor'
		+'</div>';

		Ext.apply(this, {
			layout: {
				type: 'border' //,
				/*padding: '0 5 5 5'*/ // pad the layout from the window edges
			},
			items: [/*{
				id: 'app-header',
				xtype: 'box',
				region: 'north',
				height: 40,
				html: 'Dashboard'
			},*/
			{
				xtype: 'container',
				region: 'center',
				layout: 'border',
				items: [/*{
					id: 'app-options',
					title: 'Options',
					region: 'west',
					animCollapse: true,
					width: 200,
					minWidth: 150,
					maxWidth: 400,
					split: true,
					collapsible: true,
					layout:{
						type: 'accordion',
						animate: true
					},
					items: [{
						html: content,
						title:'Navigation',
						autoScroll: true,
						border: false,
						iconCls: 'nav'
					},{
						title:'Settings',
						html: content,
						border: false,
						autoScroll: true,
						iconCls: 'settings'
					}]
				},*/{
					id: 'app-portal',
					xtype: 'portalpanel',
					region: 'center',
					items: [{
						id: 'col-1',
						items: [{
							id: 'portlet-movement',
							title: _('Connected devices'),
							tools: this.getTools(),
							items: [{
								xtype: 'movementportlet'
							}],
							listeners: {
								'close': Ext.bind(this.onPortletClose, this)
							}
						}, {
							id: 'portlet-users',
							title: _('Active users'),
							tools: this.getTools(),
							items: [{
								xtype: 'usersportlet'
							}],
							listeners: {
								'close': Ext.bind(this.onPortletClose, this)
							}
						}]
					}, {
						id: 'col-2',
						items: [{
							id: 'portlet-condition',
							title: _('Technical condition'),
							tools: this.getTools(),
							items: [{
								xtype: 'conditionportlet'
							}],
							listeners: {
								'close': Ext.bind(this.onPortletClose, this)
							}
						}, {
							id: 'portlet-map-2',
							itemId: 'portlet-map-panel2',
							title: _('Map - Device 2'),
							tools: this.getTools(),
							items: [{
								xtype: 'panel',
								height: 300,
								layout: 'fit',
								border: false,
								items: [{
									itemId: 'portlet-map2',
									xtype: 'act_map',
									baseLayerType: 'baselayer_portlet',
									hideObjectsPanel: true,
									hideToolbar: true,
									header: false
								}]
							}],
							listeners: {
								'close': Ext.bind(this.onPortletClose, this)
							}
						}]
					}, {
						id: 'col-3',
						items: [{
							id: 'portlet-balance',
							title: _('Account balance chart'),
							tools: this.getTools(),
							items: [{
								xtype: 'balanceportlet'
							}],
							listeners: {
								'close': Ext.bind(this.onPortletClose, this)
							}
						}, {
							id: 'portlet-map-1',
							itemId: 'portlet-map-panel1',
							title: _('Map - Device 1'),
							tools: this.getTools(),
							items: [{
								xtype: 'panel',
								height: 300,
								layout: 'fit',
								border: false,
								items: [{
									itemId: 'portlet-map1',
									xtype: 'act_map',
									baseLayerType: 'baselayer_portlet',
									hideObjectsPanel: true,
									hideToolbar: true,
									header: false
								}]
							}],
							listeners: {
								'close': Ext.bind(this.onPortletClose, this)
							}
						}]
					}]
				}]
			}]
		});
		this.callParent(arguments);

		// Portlet map 1
		this.portletMap1 = this.down('#portlet-map1');
		this.portletMap1.mapBaseLayer.on({
			engineLoad: 'onEngineLoad1',
			scope: this
		});

		this.portletMapPanel1 = this.down('#portlet-map-panel1');
		

		// Portlet map 2
		this.portletMap2 = this.down('#portlet-map2');
		this.portletMap2.mapBaseLayer.on({
			engineLoad: 'onEngineLoad2',
			scope: this
		});

		this.portletMapPanel2 = this.down('#portlet-map-panel2');
	},

/**
	 * Portlet 1 device load
	 */
	onEngineLoad1: function() {
		this.setPortletDevice('ЗИЛ A467HB',
			this.portletMap1, this.portletMapPanel1);
	},

/**
	 * On engine load 2
	 */
	onEngineLoad2: function() {
		this.setPortletDevice('ВАЗ 2114 P424KB',
			this.portletMap2, this.portletMapPanel2);
	},

/**
	 * Set portlet device
	 */
	setPortletDevice: function(name, portletMap, portletPanel) {
		var store = C.getStore('mon_device');
		var deviceIndex = store.find('name', name);

		var device = store.getAt(deviceIndex);
		if (device) {
			//portletMap.followSelected(null, true);
			portletMap.mapBaseLayer.toggleSelectedTracking(
				true,
				false
			);
			portletMap.selectDeviceById(device.get('id'));
			portletMap.mapBaseLayer.setSelectedObject(
				'mon_device', device.get('id'));
			portletMap.mapBaseLayer.setDevices([device.get('id')],
				true, true);

			portletPanel.setTitle(_('Map') + ' - ' + name);
		}
	},

/**
	 *  Portlet close handler
	 */
	onPortletClose: function(portlet) {
        this.showMsg('"' + portlet.title + '" was removed');
    },

/**
	 * Show msg
	 */
    showMsg: function(msg) {
        var el = Ext.get('app-msg'),
            msgId = Ext.id();

        this.msgId = msgId;
        el.update(msg).show();

        Ext.defer(this.clearMsg, 3000, this, [msgId]);
    },

/**
	 * Clear msg
	 */
    clearMsg: function(msgId) {
        if (msgId === this.msgId) {
            Ext.get('app-msg').hide();
        }
    }
});