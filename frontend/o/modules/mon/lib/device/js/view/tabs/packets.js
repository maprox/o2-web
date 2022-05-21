/**
 * @class O.mon.lib.device.tab.Packets
 * @extends O.common.lib.modelslist.Tab
 */
Ext.define('O.mon.lib.device.tab.Packets', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.mon-lib-device-tab-packets',

	prefix: '',

/*  Default configuration */
	bodyPadding: 10,
	defaults: {
		labelAlign: 'top',
		width: 400
	},

/**
	* @constructor
	*/
	initComponent: function() {
		var utcval = C.getSetting('p.utc_value');
		this.columnsArray = [{
			header: _('Receive time'),
			dataIndex: 'event_dt',
			width: 150,
			fixed: true,
			xtype: 'datecolumn',
			renderer: function(value) {
				if (value) {
					return Ext.Date.format(value.pg_utc(utcval),
						O.format.Timestamp);
				}
				return value;
			}
		}, {
			header: _('Packet time'),
			dataIndex: 'time',
			width: 150,
			fixed: true,
			xtype: 'datecolumn',
			renderer: function(value) {
				if (value) {
					return Ext.Date.format(value.pg_utc(utcval),
						O.format.Timestamp);
				}
				return value;
			}
		}, {
			header: _('Coordinates'),
			dataIndex: 'coordinates',
			sortable: false,
			flex: 1//,
			//align: 'right'
		}, {
			header: _('Altitude'),
			dataIndex: 'altitude',
			sortable: false,
			flex: 1,
			align: 'right'
		}, {
			header: _('Speed'),
			dataIndex: 'speed',
			xtype: 'numbercolumn',
			sortable: false,
			flex: 1,
			align: 'right',
			format: '0.00'
		}, {
			header: _('Odometer'),
			dataIndex: 'odometer_ext',
			sortable: false,
			flex: 1,
			align: 'right',
			renderer: function(value) {
				return Ext.util.Format.number(value / 1000, '0.00');
			}
		}, {
			header: _('HDOP'),
			xtype: 'numbercolumn',
			dataIndex: 'hdop',
			sortable: false,
			flex: 1,
			//width: 80,
			align: 'right',
			format: '0.0'
		}, {
			//header: _('Azimuth'),
			dataIndex: 'azimuth',
			sortable: false,
			//flex: 1,
			width: 40,
			align: 'center',
			renderer: function(value) {
				var angle = Math.round(value / 10) * 10;
				if (angle == 360) angle = 0;
				return '<img src="'
					+ STATIC_PATH + '/img/icons/arrow_move/00ff00/'
					+ angle + '.png' + '" />';
			}
		}, {
			//header: _('Satellites count'),
			dataIndex: 'satellitescount',
			sortable: false,
			width: 40,
			renderer: function(value) {
				var progressWidth = new Array(
				4, 4, 4, 4, 8, 8, 12, 12, 16
				);
				if (value > progressWidth.length - 1) {
					value = progressWidth.length - 1;
				}
				var str = "<div class='gps-signal-info'"
					+ "data-qtip='"
					+ _('Satellites') + ": " + value
					+ "' >" +
					"<div class='gps-signal-meter' style='width: " +
					progressWidth[value] + "px !important;'></div></div>";
				return str;
			}
		}];
		var packetsStore = Ext.create('Ext.data.Store', {
			model: 'Mon.Packet',
			storeId: 'monPacketStore',
			proxy: Ext.create('Ext.data.proxy.Ajax', {
				api: {
					read: '/mon_packet'
				},
				actionMethods: {
					read: 'GET'
				},
				reader: {
					type: 'json',
					successProperty: 'success',
					root: 'data',
					totalProperty: 'count'
				}
			}),
			remoteSort: true,
			sorters: [{
				property: 'event_dt',
				direction: 'DESC'
			}]
		});
		Ext.apply(this, {
			title: _('Packets'),
			itemId: 'packets',
			layout: 'fit',
			bodyPadding: 0,
			items: [{
				xtype: 'gridpanel',
				itemId: 'packetsgrid',
				store: packetsStore,
				layout: 'fit',
				cls: 'wrappedgrid',
				border: false,
				columnLines: false,
				columns: this.columnsArray,
				viewConfig: {
					emptyText: _('No packets found for given period'),
					getRowClass: function(record, index) {
						return 'row_packet_state' + record.get('state');
					}
				},
				trackMouseOver: false,
				enableColumnResize: true
			}],
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: packetsStore,
				dock: 'bottom',
				displayInfo: true
			}, {
				xtype: 'periodchooser',
				dock: 'top',
				itemId: 'periodChooser',
				immediateLoad: true
			}]
		});
		this.callParent(arguments);
	}
});
