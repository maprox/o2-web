/**
 * @copyright  2012, Maprox LLC
 */
/**
 * Device information panel
 * @class M.lib.deviceinfo.InfoPanel
 * @extend C.ui.Panel
 */
Ext.define('M.lib.deviceinfo.InfoPanel', {
	extend: 'C.ui.Panel',
	alias: 'widget.deviceinfo-infopanel',

/*  Configuration */
	config: {
		layout: 'fit',
		scrollable: 'vertical',
		cls: 'device-infopanel',
		tpl: null
	},

/**
	* @construct
	*/
	initialize: function() {
		// call parent
		this.callParent(arguments);
		// initialization
		this.setTpl(new Ext.XTemplate(
			'<table class="device-infotable">',
			'<tr>',
				'<td class="title">', _('Name'), '</td>',
				'<td class="value"><b>', '{device.name}' , '</b></td>',
			'</tr>',
			'<tpl if="this.getStatus(values)">',
				'<tr>',
					'<td class="title">', _('Status'), '</td>',
					'<td class="value">',
						'{[this.getStatus(values)]}',
					'</td>',
				'</tr>',
			'</tpl>',
			'<tpl if="this.getSensorValue(values, \'gpsantenna\') == 0">',
				'<tr>',
					'<td class="title">', _('GPS antenna'), '</td>',
					'<td class="value">',
						'<span class="status_disconnected">',
							_('Detached'),
						'</span>',
					'</td>',
				'</tr>',
			'</tpl>',
			'<tr>',
				'<td class="title">', _('Time'), '</td>',
				'<td class="value">',
					'{[this.getDateValue(values.getTime(), values)]}',
				'</td>',
			'</tr>',
			'<tpl if="this.getSpeedValue(values.speed, null, values)">',
				'<tr>',
					'<td class="title">', _('Speed'), '</td>',
					'<td class="value">',
						'{[this.getSpeedValue(values.speed, null, values)]}',
					'</td>',
				'</tr>',
			'</tpl>',
			'<tpl if="this.hasValue(odometer)">',
			'<tpl if="this.getDistanceValue(values.odometer, null, values)">',
				'<tr>',
					'<td class="title">', _('Mileage'), '</td>',
					'<td class="value">',
						'{[this.getDistanceValue(values.odometer, null, values)]}',
					'</td>',
				'</tr>',
			'</tpl>',
			'</tpl>',
			'<tpl if="this.getSignalBar(values.satellitescount, 8, values)">',
				'<tr>',
					'<td class="title">', _('Sat. signal'), '</td>',
					'<td class="value">',
						'{[this.getSignalBar(values.satellitescount, 8, values)]}',
					'</td>',
				'</tr>',
			'</tpl>',
			'<tr>',
				'<td class="title">', _('Place'), '</td>',
				'<td class="value">', '{address}', '</td>',
			'</tr>',
			'<tr>',
				'<td class="title">', _('Coords'), '</td>',
				'<td class="value">',
					'{[this.getCoordsValue(values.latitude, values.longitude)]}',
				'</td>',
			'</tr>',
			'{[this.getSensors(values)]}',
			'<tpl if="this.getDistanceValue(values.altitude, 1, values)">',
				'<tr>',
					'<td class="title">', _('Altitude'), '</td>',
					'<td class="value">',
						'{[this.getDistanceValue(values.altitude, 1, values)]}',
					'</td>',
				'</tr>',
			'</tpl>',
			'<tpl if="this.getLastImage(values)">',
				'<tr id= "lastimagetr">',
					'<td class="title">', _('Last image'), '</td>',
					'<td class="value">',
						'{[this.getLastImage(values)]}',
					'</td>',
				'</tr>',
			'</tpl>',
			'</table>',
			{
				hasValue: function(value) {
					return ((typeof(value) !== 'undefined') &&
						(value !== null));
				},
				getDateValue: function(value, p) {
					var fmt = O.format.TimeShort + ' (' + O.format.Date + ')';
					var time = C.utils.fmtDate(new Date(value), fmt);

					if (p.device.lastimage
						&& p.id_type == C.cfg.packetType.STATIC_POINT)
					{
						var img = Ext.decode(p.device.lastimage);
						time = Ext.Date.format(
							C.utils.toDate(img.time)
								.pg_utc(C.getSetting('p.utc_value')),
							fmt
						);
					}

					return time;
				},
				getSpeedValue: function(value, fmtType, p) {
					// If static pint
					if (p.id_type == C.cfg.packetType.STATIC_POINT) {
						return null;
					}

					return C.utils.fmtSpeed(value, fmtType);
				},
				getDistanceValue: function(value, fmtType, p) {
					// If static point
					if (p.id_type == C.cfg.packetType.STATIC_POINT) {
						return null;
					}

					return C.utils.fmtOdometer(value, fmtType);
				},
				getSignalBar: function(value, maxValue, p) {
					// If static point
					if (p.id_type == C.cfg.packetType.STATIC_POINT) {
						return null;
					}

					maxValue = (maxValue) ? maxValue : value;
					var percent = value / maxValue;
					if (percent > 1) { percent = 1; }
					var width = Ext.util.Format.round(4 * percent, 0) * 4;
					var html = "<div class='signal-container'>" +
						"<div class='signal-meter' style='width: " +
							width + "px !important;'></div></div>";
					return html;
				},
				getCoordsValue: function(lat, lon) {
					return C.utils.fmtCoord({
						latitude: lat,
						longitude: lon
					});
				},
				getBatteryValue: function(value, p) {
					// If static point
					if (p.id_type == C.cfg.packetType.STATIC_POINT) {
						return null;
					}

					return value;
				},
				getSensorValue: function(p, sensor) {
					// If static point
					if (p.id_type == C.cfg.packetType.STATIC_POINT) {
						return null;
					}

					return p.getSensorValue(sensor);
				},
				getStatus: function(p) {
					// If static point
					if (p.id_type == C.cfg.packetType.STATIC_POINT) {
						return false;
					}

					var device = p.device;
					var status, statusAlias;
					if (device.isConnected()) {
						if (device.isMoving()) {
							status = _('Move');
							statusAlias = 'move';
						} else {
							status = _('Stay');
							statusAlias = 'stay';
						}
					} else {
						var currentServerTime = O.manager.Model.getServerTime();
						var time = O.timeperiod.formatPeriod(
							currentServerTime - p.time);
						status = _('Disconnected %s').replace(/%s/g, time);
						statusAlias = 'disconnected';
					}
					return '<span class="status_' + statusAlias + '">' +
						status + '</span>';
				},
				getLastImage: function(p) {
					var value = p.device.lastimage;

					if (!value) {
						return false;
					}

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
					var str = "<div class='last-image' id='lastimage'>" +
							"<div class='last-image-description'>" +
							description + "</div>" +
							"<img src='" + imgpath + "'></img>"
							+ "</div>";

					return str;
				},
				getSensors: function(p) {
					var sensors = p.getDisplaySensors();
					var code = '';
					Ext.Array.each(sensors, function(sensor) {
						var row = [
						'<tr>',
							'<td class="title">', sensor.name, '</td>',
							'<td class="value">',
								sensor.value,
							'</td>',
						'</tr>'
						];
						code = code + row.join('');
					});

					return code;
				}
			}
		));
	}
});
