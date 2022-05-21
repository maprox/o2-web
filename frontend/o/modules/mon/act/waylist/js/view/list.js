/**
 * @class O.mon.waylist.List
 * @extends O.common.lib.modelslist.List
 */
C.define('O.mon.waylist.List', {
	extend: 'O.common.lib.modelslist.RemoteList',
	alias: 'widget.mon_waylist_list',

/*  Configuration */
	columnLines: false,

/**
	* Inner state id postfix
	* @type {String}
	*/
	innerStateId: null,
	border: false,
	enableSearch: false,

/**
	* Rest controller name
	* @type {String}
	*/
	managerAlias: 'mon_waylist',

/**
	* @constructor
	*/
	constructor: function() {
		Ext.apply(this, {
			features: [{
				ftype: 'grouping',
				//hideGroupedHeader: true,
				groupHeaderTpl: '{name} ({rows.length})'
			}]
		});
		this.callParent(arguments);
	},

/**
	* @constructor
	*/
	initComponent: function() {
		this.store = C.getStore('mon_waylist', {
			remoteFilter: true,
			remoteSort: true,
			sorters: [{
				property: 'dt',
				direction: 'DESC'
			}],
			proxy: {
				type: 'ajax',
				url: '/mon_waylist',
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
			//pageSize: 3,
			autoLoad: false
		});

		// init component view
		Ext.apply(this, {
			stateful: this.stateful || true,
			stateId: 'mon-waylist-list-' + (this.innerStateId || 'main'),
			stateEvents: ['groupchange'],
			columns: {
				defaults: {
					menuDisabled: true,
					groupable: false
				},
				items: [{
					xtype: 'templatecolumn',
					width: 30,
					fixed: true,
					tpl: new Ext.XTemplate(
						'<tpl if="status == Mon.Waylist.CREATED">',
							'<img title="' +_('Created') + '" src=' +
								STATIC_PATH + '/img/waylist/created.png />',
						'<tpl elseif="status == Mon.Waylist.STARTED">',
							'<img title="' +_('Started') + '" src=' +
								STATIC_PATH + '/img/waylist/started.png />',
						'<tpl else>',
							'<img title="' +_('Closed') + '" src=' +
								STATIC_PATH + '/img/waylist/closed.png />',
						'</tpl>',
						{
							getImage: function(name){
								return '';
							}
						}
					)
				}, {
					xtype: 'datecolumn',
					header: _('Date'),
					dataIndex: 'dt',
					width: 80,
					fixed: true,
					format: O.format.Date,
					align: 'right'
				}, {
					header: _('Series'),
					dataIndex: 'serial_num',
					width: 70,
					fixed: true,
					menuDisabled: false,
					groupable: true,
					align: 'center'
				}, {
					header: _('Number'),
					dataIndex: 'num',
					width: 70,
					fixed: true,
					align: 'right'
				}, {
					header: _('Driver'),
					dataIndex: 'id_driver$fullname',
					menuDisabled: false,
					groupable: true,
					flex: 1
				}, {
					header: _('Vehicle name'),
					dataIndex: 'id_vehicle$car_model',
					renderer: function(value, cls, record) {
						return value || record.get('id_vehicle$name');
					},
					menuDisabled: false,
					groupable: true,
					flex: 1
				}, {
					header: _('Vehicle registration identifier'),
					dataIndex: 'id_vehicle$license_number',
					menuDisabled: false,
					groupable: true,
					flex: 1
				}, {
					header: _('Type'),
					dataIndex: 'id_type$name',
					menuDisabled: false,
					groupable: true,
					flex: 1
				}, {
					xtype: 'numbercolumn',
					header: _('Expected distance'),
					dataIndex: 'distance_km',
					flex: 1,
					align: 'right'
				}, {
					xtype: 'numbercolumn',
					header: _('Actual distance'),
					dataIndex: 'actual_distance_km',
					flex: 1,
					align: 'right'
				}, {
					xtype: 'numbercolumn',
					header: _('Expected fuel'),
					dataIndex: 'fuel',
					flex: 1,
					align: 'right'
				}, {
					xtype: 'numbercolumn',
					header: _('Actual fuel'),
					dataIndex: 'actual_fuel',
					flex: 1,
					align: 'right'
				}]
			},
			viewConfig: {
				emptyText: '<span class="emptyGrid">' +
					_('No waylists') + '</span>',
				getRowClass: function(record, rowIndex, p, store) {
					var cls = '';
					if (record.get('status') == Mon.Waylist.CREATED) {
						cls += ' waylist_created';
					}
					if (record.get('status') == Mon.Waylist.STARTED) {
						cls += ' waylist_started';
					}
					if (record.get('status') == Mon.Waylist.CLOSED) {
						cls += ' waylist_closed';
					}
					if (record.get('failed')) {
						cls += ' waylist_failed';
					}
					return cls;
				}
			},
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: this.store,
				dock: 'bottom',
				displayInfo: true
			}]
		});
		this.callParent(arguments);
		// set component access variables
		this.btnAdd.setText(_('Create waylist'));
	}
});
