/**
 * Displays packet data
 * @class O.mon.trackhistory.PacketDat
 * @extends Ext.grid.Panel
 */
C.define('O.mon.trackhistory.PacketData', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.history-packetdata',

	/**
	* @constructor
	*/
	initComponent: function() {

		var store = Ext.create('Ext.data.Store', {
			storeId: 'historyPacketPropertiesStore',
			fields: [
				'packetItemName',
				'packetItemValue'
			],
			autoload: false,
			proxy: {
				type: 'memory'
			}
		});

		Ext.apply(this, {
			items: [{
				xtype: 'gridpanel',
				flex: 1,
				border: false,
				bodyBorder: false,
				hideHeaders: true,
				store: store,
				cls: 'wrappedgrid',
				columns: [{
					header: '',
					dataIndex: 'packetItemName',
					width: 120,
					fixed: true
				}, {
					itemId: 'dataColumn',
					header: '',
					dataIndex: 'packetItemValue',
					flex: 1,
					renderer: this.renderer
				}]
			}]
		});

		this.callParent(arguments);
	},

	/**
	* Рендеринг индикатора сигнала GPS
	* @param {int} value - кол-во спутников
	*/
	renderer: function(value, meta, record, rowIndex) {
		if (record.get('packetItemName') == _('GPS signal')) {
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
		} else if (record.get('packetItemName') == _('Last image')) {
			var img = Ext.decode(value);
			var utc = C.getSetting('p.utc_value');
			var description = '';
			if (img.time) {
				description = Ext.util.Format.date(
					new Date().pg_fmt(img.time).pg_utc(utc),
					O.format.Timestamp
				);
			}
			var imgpath = '/mon_device_image/' + img.id + '/draw/small';
			var str = "<div class='last-image'>" +
					"<div class='last-image-description'>" +
						description +
					"</div>" +
					"<img src='" + imgpath + "'></img>"
				"</div>";
			return str;
		} else {
			return value;
		}
	}
});