/**
 * @class O.mon.lib.waylist.TabRoute
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.mon.lib.waylist.RouteList', {
	extend: 'O.common.lib.modelslist.List',
	alias: 'widget.mon-waylist-routelist',

/**
	* Set true to enable loading of store data after render.
	* Defaults to true
	* @type {Boolean}
	*/
	autoLoadStore: false,

	/**
	 * Last fired points coordinates
	 * @type {Object[]}
	 */
	lastCoords: null,

	/**
	 * Last starting garage id
	 * @type {Number}
	 */
	lastStart: 0,

	/**
	 * Last ending garage id
	 * @type {Number}
	 */
	lastEnd: 0,

	/**
	 * True to display messages on succesful creation/update
	 * @type {Boolean}
	 */
	displaySuccessMessages: false,

/*  Properties */
	hideHeaders: false,
	border: false,
	model: 'Mon.WaylistRoute',
	managerAlias: 'mon_waylist_route',
	newRecordIsFirst: false,
	enableSearch: false,
	enableShowDeleted: false,

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			stateful: false,
			store: C.getStore(this.managerAlias),
			columns: {
				defaults: {
					menuDisabled: true,
					groupable: false,
					sortable: false
				},
				items: [{
					width: 40,
					align: 'right',
					dataIndex: 'num',
					tdCls: 'x-grid-cell-special',
					fixed: true
				}, {
					header: _('Place'),
					dataIndex: 'id_point',
					renderer: function(value, style, r) {
						var name = r.get('id_point$name');
						var address = r.get('id_point$address');
						return '<b>' + name + '</b>' +
							(address ? '<br/>' + address : '');
					},
					flex: 1,
					editor: {
						xtype: 'combobox',
						displayField: 'name',
						valueField: 'id',
						allowBlank: false,
						store: C.getStore('mon_geofence'),
						queryMode: 'local',
						listConfig: {
							itemTpl: Ext.create('Ext.XTemplate',
								'<tpl if="address">',
									'<b>{name}</b><br/>{address}',
								'<tpl else>',
									'{name}',
								'</tpl>'
							)
						}
					}
				}, {
					xtype: 'numbercolumn',
					header: _('Distance, km'),
					dataIndex: 'distance_km',
					width: 100,
					align: 'right',
					format: '0.00',
					editor: {
						xtype: 'numberfield'
					}
				}, {
					xtype: 'intervalcolumn',
					header: _('Travel time'),
					dataIndex: 'time_way',
					width: 90,
					tpl: '{time_way}',
					align: 'center',
					format: O.format.TimeShort,
					editor: {
						xtype: 'intervalfield',
						format: O.format.TimeShort
					}
				}, {
					xtype: 'datecolumn',
					header: _('Arrival time'),
					dataIndex: 'expect_dt',
					width: 90,
					format: O.format.DateShort + ' ' + O.format.TimeShort
				}, {
					xtype: 'intervalcolumn',
					header: _('Wait time'),
					dataIndex: 'time_stay',
					width: 100,
					tpl: '{time_stay}',
					align: 'center',
					format: O.format.TimeShort,
					editor: {
						xtype: 'intervalfield',
						format: O.format.TimeShort
					}
				}, {
					header: _('Condition'),
					width: 100,
					renderer: function(value, metaData, record) {
						var ret, cls;
						if (record.isCleared()) {
							if (record.isLate()) {
								ret = _('Late');
								cls = 'warning';
							} else {
								ret = _('Arrived');
								cls = 'good';
							}
						} else {
							if (record.isLate()) {
								ret = _('Overdue');
								cls = 'warning';
							} else {
								ret = _('On the way');
								cls = 'normal';
							}
						}
						return '<span class="route_condition_' + cls + '">' +
							ret + '</span>';
					},
					align: 'center'
				}]
			}
		});
		this.callParent(arguments);

		this.btnCalculate = this.down('#btnCalculate');
	},

	/**
	 * Returns toolbar buttons configuration
	 * @return {Array}
	 */
	getToolbarButtons: function() {
		var buttons = this.callParent(arguments),
			ret = [],
			calculateBtn = {
				itemId: 'btnCalculate',
				text: _('Calculate'),
				iconCls: 'routelist-calculate'
			},
			inserted = false;
		Ext.each(buttons, function(button){
			if (!inserted && button.xtype == 'tbfill') {
				inserted = true;
				ret.push(calculateBtn);
			}
			ret.push(button);
		});

		if (!inserted) {
			ret.push(calculateBtn);
		}

		return ret;
	}
});
