/**
 * @class O.mon.lib.fuel.consumption.report.ItemList
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.mon.lib.fuel.consumption.report.ItemList', {
	extend: 'O.common.lib.modelslist.List',
	alias: 'widget.mon-fuel-consumption-report-itemlist',

/**
	* Set true to enable loading of store data after render.
	* Defaults to true
	* @type {Boolean}
	*/
	autoLoadStore: false,

/*  Properties */
	hideHeaders: false,
	border: false,
	model: 'Mon.Fuel.Consumption.Report.Item',
	managerAlias: 'mon_fuel_consumption_report_item',
	newRecordIsFirst: false,
	enableSearch: false,
	enableShowDeleted: false,
	showCreateNewRecordButton: false,

/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;

		this.workerStore = C.getStore('dn_worker');

		Ext.apply(this, {
			cls: 'vehicle-itemlist',
			stateful: false,
			store: C.getStore('mon_fuel_consumption_report_item', {
				sorters: [{
					property: 'num',
					direction: 'ASC'
				}],
				proxy: {
					type: 'ajax',
					url: '/mon_fuel_consumption_report_item',
					reader: {
						type: 'json',
						root: 'data',
						totalProperty: 'count'
					}
				}
			}),
			columns: {
				defaults: {
					menuDisabled: true,
					groupable: false,
					sortable: false
				},
				items: [{
					xtype: 'rownumberer',
					width: 40,
					fixed: true
				}, {
					header: _('Car model'),
					dataIndex: 'id_vehicle$car_model',
					width: 100,
					editable: false
				}, {
					header: _('License number'),
					dataIndex: 'id_vehicle$license_number',
					width: 100,
					editable: false
				}, {
					header: _('Responsible for the operation'),
					dataIndex: 'id_responsible_person',
					renderer: function(value) {
						var record = me.workerStore.getById(value);

						if (Ext.isEmpty(record)) {
							return value;
						}

						return record.get('fullname');
					},
					editor: {
						xtype: 'combo',
						store: this.workerStore,
						triggerAction: 'all',
						lastQuery: '',
						valueField: 'id',
						displayField: 'fullname',
						queryMode: 'local',
						editable: false,
						forceSelection: true
					},
					width: 200
				}, {
					xtype: 'numbercolumn',
					header: _('Consumption rate'),
					dataIndex: 'consumption_rate',
					flex: 1,
					format: '0.00',
					editor: {
						xtype: 'numberfield'
					}
				}, {
					xtype: 'numbercolumn',
					header: _('Consumption limit'),
					dataIndex: 'consumption_limit',
					flex: 1,
					format: '0.00',
					editor: {
						xtype: 'numberfield'
					}
				}, {
					xtype: 'numbercolumn',
					header: _('Waylist mileage'),
					dataIndex: 'mileage_waylist',
					flex: 1,
					format: '0.00',
					editor: {
						xtype: 'numberfield'
					}
				}, {
					xtype: 'numbercolumn',
					header: _('Maprox mileage'),
					dataIndex: 'mileage_track',
					flex: 1,
					format: '0.00',
					editable: false
				}, {
					xtype: 'numbercolumn',
					header: _('Consumption by norm'),
					dataIndex: 'consumption_by_norm',
					flex: 1,
					format: '0.00',
					editable: false
				}, {
					xtype: 'numbercolumn',
					header: _('Actual consumption'),
					dataIndex: 'consumption_fact',
					flex: 1,
					format: '0.00',
					editor: {
						xtype: 'numberfield'
					}
				}, {
					xtype: 'numbercolumn',
					header: _('Previous month remainder'),
					dataIndex: 'previous_month_remainder',
					flex: 1,
					format: '0.00',
					editor: {
						xtype: 'numberfield'
					}
				}, {
					xtype: 'numbercolumn',
					header: _('Received'),
					dataIndex: 'received',
					flex: 1,
					format: '0.00',
					editor: {
						xtype: 'numberfield'
					}
				}, {
					xtype: 'numbercolumn',
					header: _('Next month remainder'),
					dataIndex: 'next_month_remainder',
					flex: 1,
					format: '0.00',
					editor: {
						xtype: 'numberfield'
					}
				}, {
					xtype: 'numbercolumn',
					header: _('Overrun'),
					dataIndex: 'overrun',
					flex: 1,
					format: '0.00',
					editable: false
				}]
			}
		});
		this.callParent(arguments);
	}
});
