/**
 * @class O.mon.lib.waylist.RouteFact
 * @extends O.common.lib.modelslist.List
 */
C.define('O.mon.lib.waylist.RouteFact', {
	extend: 'C.ui.Panel',
	alias: 'widget.mon-waylist-routefact',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'grid',
				title: _('Factual performance'),
				layout: 'fit',
				stateful: false,
				store: {
					model: Mon.WaylistRoute,
					proxy: {
						type: 'memory'
					},
					sorters: [
						{property: 'enter_dt', direction: 'ASC'}
					]
				},
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
						flex: 4
					}, {
						xtype: 'numbercolumn',
						header: _('Distance, km'),
						dataIndex: 'actual_distance_km',
						flex: 1,
						align: 'right',
						format: '0.00'
					}, {
						xtype: 'datecolumn',
						header: _('Arrival time'),
						dataIndex: 'enter_dt',
						flex: 1,
						format: O.format.DateShort + ' ' + O.format.TimeShort,
						align: 'center'
					}, {
						header: _('Wait time'),
						dataIndex: 'time_stay_fact',
						flex: 1,
						align: 'center'
					}]
				}
			}]
		});
		this.callParent(arguments);

		this.grid = this.down('grid');
		this.gridStore = this.grid.getStore();
	}
});
