/**
 * @class O.mon.lib.waylist.tab.History
 * @extends Ext.grid.Panel
 */
C.define('O.mon.lib.waylist.tab.History', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.mon-waylist-tab-history',

	/*  Configuration */
	bodyPadding: 0,

	/* History values translation */
	typesWaylist: {
		'id_company_owner': 'company',
		'serial_num': 'series',
		'num': 'serial number',
		'sdt': 'start date',
		'edt': 'end date',
		's_point': 'start point',
		'e_point': 'end point',
		'distance': ['distance', 'km'],
		'actual_distance': ['actual distance', 'km'],
		'fuel_expense': 'fuel expense',
		's_odometer': ['start odometer', 'km'],
		'e_odometer': ['end odometer', 'km'],
		'id_vehicle': 'vehicle',
		'id_trailer': 'trailer',
		'id_driver': 'driver',
		'id_driver2': 'second driver',
		's_id_mechanic': 'start point mechanic',
		's_id_dispatcher': 'start point dispatcher',
		'e_id_mechanic': 'end point mechanic',
		'e_id_dispatcher': 'end point dispatcher',
		'refuel_amount': ['refuel amount', 'l'],
		's_fuel': ['start fuel', 'l'],
		'e_fuel': ['end fuel', 'l'],
		'id_fuel': 'fuel type',
		'fuel_fact': ['fuel factual expense', 'l'],
		'medician': 'medician',
		'id_company_disposal': 'disposal company',
		'id_point_submission': 'place of submission',
		'note': 'note',
		'auto_close_fence': 'auto close on finish',
		'status': 'status'
	},

	typesRoute: {
		'num': 'ordered number',
		'id_point': 'place',
		'id_company_disposal': 'disposal company',
		'time_way': 'time on the way',
		'time_stay': 'time of the stopping',
		'distance': ['distance', 'km'],
		'enter_dt': 'entrance time',
		'exit_dt': 'takeoff time'
	},

	translatable: ['auto_close_fence', 'status'],


	/**
	 * @constructor
	 */
	initComponent: function() {
		var store = Ext.create('Ext.data.Store', {
			model: X.History,
			autoLoad: false,
			proxy: {
				type: 'ajax',
				url: '/x_history/mon_waylist/',
				reader: {
					type: 'json',
					root: 'data',
					totalProperty: 'count'
				},
				extraParams: {
					'$showtotalcount': true
				}
			},
			pageSize: 20,
			sorters: [{property: 'dt',  direction: 'ASC'}]
		});

		var me = this;
		Ext.apply(this, {
			title: _('History'),
			itemId: 'history',
			layout: 'fit',
			items: [{
				xtype: 'grid',
				layout: 'fit',
				columns: [{
					xtype: 'datecolumn',
					format: O.format.Timestamp,
					header: _('Time'),
					dataIndex: 'dt',
					flex: 1
				}, {
					header: _('User'),
					dataIndex: 'username',
					renderer: this.renderName,
					flex: 1
				}, {
					header: _('Action'),
					dataIndex: 'type',
					renderer: this.renderType,
					flex: 1
				}],
				store: store,
				dockedItems: [{
					xtype: 'pagingtoolbar',
					store: store,
					dock: 'bottom',
					displayInfo: true
				}],
				plugins: [{
					ptype: 'o-rowexpander',
					rowBodyTpl: new Ext.XTemplate(
						'<p>', '{[this.formatData(values)]}', '</p>',
						{
							formatData: function(values){
								return me.renderDiff(values.diff,
									values.data, values.type);
							}
						}
					)
				}]
			}]
		});

		this.callParent(arguments);

		this.grid = this.down('grid');
		this.gridStore = this.grid.getStore();
	},

	/**
	 * Renderer for history type
	 * @param value
	 * @param style
	 * @param record
	 * @return {String}
	 */
	renderType: function(value, style, record) {
		var types = {
			create: 'Waylist created',
			edit: 'Waylist edited',
			"delete": 'Waylist deleted',
			restore: 'Waylist restored',
			process: 'Waylist processed',
			grantaccess: 'Access granted',
			editaccess: 'Access edited',
			revokeaccess: 'Access revoked'
		};

		var childTypes = {
			'create': 'Added route',
			'edit': 'Edited route',
			'delete': 'Deleted route'
		};

		if (record.get('type') == 'child_change') {
			var data = record.get('data');
			value = childTypes[data.type] ? _(childTypes[data.type]) : data.type;
			return value + ' ' + data.name;
		}

		return types[value] ? _(types[value]) : value;
	},

	/**
	 * Renderer for history type
	 * @param value
	 * @param style
	 * @param record
	 * @return {String}
	 */
	renderName: function(value, style, record) {
		if (record.get('id_user') != -1 && value) {
			return value;
		}

		return _('Automatically, by tracker data');
	},

	/**
	 * Renderer for history diff
	 * @param items
	 * @param data
	 * @param type
	 * @return {String}
	 */
	renderDiff: function(items, data, type) {
		var childFlag = (type == 'child_change');

		if (childFlag) {
			items = data.diff;

		}

		var output = [];

		Ext.each(items, function(item){
			if (item.prev === null) {
				var value = this.renderDiffAdd(item, childFlag);
			} else {
				var value = this.renderDiffChange(item, childFlag);
			}
			if (value !== null) {
				output.push(value);
			}
		}, this);

		return output.length ? output.join('. ') + '.' : '';
	},

	/**
	 * Renderer for adding value
	 * @param item
	 * @param {Boolean} childFlag
	 * @return {String}
	 */
	renderDiffAdd: function(item, childFlag) {
		var types = childFlag ? this.typesRoute : this.typesWaylist;

		if (!types[item.field]) {
			return null
		}

		var newValue = item.new_name || item['new'];

		if (typeof types[item.field] == 'string') {
			var type = _(types[item.field]);
			var postfix = '';
		} else {
			var type = _(types[item.field][0]);
			var postfix = ' '+ _(types[item.field][1]);
			if (types[item.field][1] == 'km') {
				newValue = newValue / 1000;
			}
		}

		if (this.translatable.indexOf(item.field) != -1) {
			newValue = _(newValue);
		}
		return _('Added') + ': ' + type + ', ' + newValue.toString() + postfix;
	},

	/**
	 * Renderer for editing value
	 * @param item
	 * @param {Boolean} childFlag
	 * @return {String}
	 */
	renderDiffChange: function(item, childFlag) {
		var types = childFlag ? this.typesRoute : this.typesWaylist;

		if (!types[item.field]) {
			return null
		}

		var prevValue = item.prev_name || item.prev;
		var newValue = item.new_name || item['new'];

		if (typeof types[item.field] == 'string') {
			var type = _(types[item.field]);
			var postfix = '';
		} else {
			var type = _(types[item.field][0]);
			var postfix = ' '+ _(types[item.field][1]);
			if (types[item.field][1] == 'km') {
				prevValue = prevValue / 1000;
				newValue = newValue / 1000;
			}
		}

		if (this.translatable.indexOf(item.field) != -1) {
			prevValue = _(prevValue);
			newValue = _(newValue);
		}

		return _('Edited') + ': ' + type + ', ' + _('from') + ' ' +
			prevValue.toString() + postfix + ' ' + _('to') + ' ' +
			newValue.toString() + postfix;
	}
});