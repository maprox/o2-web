/**
 * @class O.mon.act.condition.Grid
 * @extends Ext.grid.Panel
 */
C.define('O.mon.act.condition.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.mon-condition-grid',

	/**
	 * Is currently any data loaded in grid
	 * @cfg {Boolean}
	 */
	hasData: false,

	/**
	 * Component initialization
	 */
	initComponent: function() {
		this.store = Ext.create('Ext.data.Store', {
			model: 'Mon.device.Condition',
			remoteFilter: true,
			remoteSort: true,
			sorters: [{
				property: 'name',
				direction: 'ASC'
			}],
			proxy: {
				type: 'ajax',
				url: '/mon_device',
				reader: {
					type: 'json',
					root: 'data',
					totalProperty: 'count'
				},
				extraParams: {
					'$joined': 1,
					'$showtotalcount': 1
				}
			},
			pageSize: 40,
			autoLoad: false
		});

		Ext.apply(this, {
			title: _('Devices'),
			store: this.store,
			columns: [{
				header: _('Name'),
				dataIndex: 'name',
				flex: 2
			}, {
				header: _('Marque/Model'),
				sortable: false,
				dataIndex: 'note',
				flex: 1
			}, {
				xtype: 'numbercolumn',
				header: _('Odometer, km'),
				dataIndex: 'odometer',
				flex: 1
			}, {
				xtype: 'numbercolumn',
				header: _('Errors count'),
				sortable: false,
				format:'0',
				dataIndex: 'error',
				renderer: function(value, style){
					var cls = ' device_condition_errors_ok';
					if (value.length) {
						cls = ' device_condition_errors_critical';
					}

					style.tdCls += cls;

					return value.length;
				},
				flex: 1
			}, {
				xtype: 'datecolumn',
				header: _('Connection'),
				dataIndex: 'lastconnect',
				flex: 2,
				renderer: function(value, style){
					value = value ? value.pg_utc(C.getSetting('p.utc_value')) :
						null;
					var delay = (new Date() - value) / 1000;
					var cls = ' device_condition_connection_ok';

					if (delay >= 600) {
						cls = ' device_condition_connection_warn';
						if (delay >= 2400) {
							cls = ' device_condition_connection_lost';
						}
					}
					style.tdCls += cls;

					return Ext.util.Format.date(value,
						O.format.Date + ' ' + O.format.Time);
				}
			}, {
				xtype: 'datecolumn',
				header: _('Previous MRO date'),
				sortable: false,
				dataIndex: 'prev_mro',
				flex: 2,
				format: O.format.Date
			}, {
				xtype: 'datecolumn',
				header: _('Next MRO date'),
				sortable: false,
				dataIndex: 'next_mro',
				flex: 2,
				format: O.format.Date
			}],
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: this.store,
				dock: 'bottom',
				displayInfo: true
			}]
		});
		this.callParent(arguments);
	}
});