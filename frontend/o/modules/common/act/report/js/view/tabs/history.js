/**
 * Report history grid
 * TODO rewrite to x_history ?
 * @class O.common.act.report.tab.History
 * @extends Ext.grid.Panel
 */
C.define('O.common.act.report.tab.History', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.common-report-tab-history',

/**
	* @constructor
	*/
	initComponent: function() {
		var labels = {
			'period': _('Period'),
			'mon_device': _('Devices'),
			'mon_geofence': _('Geofences'),
			'x_group_mon_device': _('Device groups'),
			'x_group_mon_geofence': _('Geofence groups')
		};

		this.store = Ext.create('Ext.data.Store', {
			model: 'ReportsHistory',
			data: []
		});

		Ext.apply(this, {
			cls: 'reports_history',
			store: this.store,
			columns: [{
				header: _('Date'),
				dataIndex: 'dt',
				width: 105,
				renderer: function(val) {
					// ??? WTF is this:
					var y = val.substr(0, 4);
					var m = val.substr(5, 2);
					var d = val.substr(8, 2);
					var h = val.substr(11, 2);
					var i = val.substr(14, 2);
					return d + '.' + m + '.' + y + ' ' + h + ':' + i;
				}
			}, {
				header: _('User'),
				dataIndex: 'username',
				width: 150
			}, {
				header: _('Parameters'),
				dataIndex: 'params',
				flex: 1,
				renderer: function(val) {
					var result = [];
					var params = Ext.JSON.decode(Base64.decode(val));
					for (var param in params) {
						var label = labels[param] || param;
						var value;
						switch (param) {
							case 'period':
								// ??? WTF is this:
								var sdt = params.period.sdt;
								var y = sdt.substr(0, 4);
								var m = sdt.substr(5, 2);
								var d = sdt.substr(8, 2);
								var h = sdt.substr(11, 2);
								var i = sdt.substr(14, 2);
								sdt = d + '.' + m + '.' + y + ' ' + h + ':' + i;
								var edt = params.period.edt;
								y = edt.substr(0, 4);
								m = edt.substr(5, 2);
								d = edt.substr(8, 2);
								h = edt.substr(11, 2);
								i = edt.substr(14, 2);
								edt = d + '.' + m + '.' + y + ' ' + h + ':' + i;
								value = sdt + ' - ' + edt;
								break;
							case 'mon_device':
							case 'mon_geofence':
							case 'x_group_mon_device':
							case 'x_group_mon_geofence':
								value = params[param].join(', ');
								break;
							default:
								value = params[param];
								break;
						}
						result.push(label + ' (' + value + ')');
					}
					return result.join(', ');
				}
			}]
		});
		this.callParent(arguments);
	}
});