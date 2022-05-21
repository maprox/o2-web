/**
 * Events Panel
 * @class M.common.lib.events.Panel
 * @extend Ext.ux.BufferedList
 */
Ext.define('M.common.lib.events.Panel', {
	extend: 'Ext.ux.BufferedList',
	alias: 'widget.eventspanel',

	/**
	 * @construct
	 */
	initialize: function() {
		var store = Ext.create('Ext.data.Store', {
			model: 'EventModel',
			proxy: {
				type: 'ajax',
				url: '/events',
				actionMethods: {read: 'POST'},
				reader: {
					type: 'json',
					rootProperty: 'data'
				}
			},
			remoteSort: true,
			sorters: [{
				property: 'dt',
				direction: 'DESC'
			}]
		});
		this.setStore(store);
		this.setEmptyText(
			'<div class="empty">' +
				_('No events found matching this period.') +
			'</div>');
		this.setItemTpl(
			new Ext.XTemplate('<div class="event">' +
				'<div class="datetime">' +
					'<span class="date">' +
						'{[this.getDate(values.dt)]}' +
					'</span> ' +
					'<span class="time">' +
						'{[this.getTime(values.dt)]}' +
					'</span> ' +
				'</div>' +
				'<div class="text">{eventtext}</div>' +
			'</div>',
			{
				getDate: function(dt) {
					return C.utils.fmtDate(
						dt.pg_utc(C.getSetting('p.utc_value')),
						O.format.Date);
				},
				getTime: function(dt) {
					return C.utils.fmtDate(
						dt.pg_utc(C.getSetting('p.utc_value')),
						O.format.Time);
				}
			})
		);
		// call parent
		this.callParent(arguments);
	}
});