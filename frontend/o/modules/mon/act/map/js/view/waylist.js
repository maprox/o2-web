/**
 *
 * Device waylist window
 * @class O.mon.act.map.Waylist
 * @extends Ext.panel.Panel
 */
C.define('O.mon.act.map.Waylist', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.waylistinfo',

	/**
	 * Currently loaded waylist
	 * @var {Integer}
	 */
	currentWaylist: null,
	/**
	 * Currently loaded device
	 * @var {O.mon.model.Device}
	 */
	currentDevice: null,
	/**
	 * Next point to reach
	 * @var {Mon.WaylistRoute}
	 */
	nextPoint: null,
	/**
	 * Time to reach that point
	 * @var {Date}
	 */
	expectDt: null,
	/**
	 * Is waylist loaded
	 * @var {Boolean}
	 */
	waylistLoaded: false,
	/**
	 * Is waylist route loaded
	 * @var {Boolean}
	 */
	waylistRouteLoaded: false,

	initComponent: function() {
		Ext.apply(this, {
			title: _('Waylist'),
			iconCls: 'waylist_ico',
			defaults: {
				xtype: 'displayfield',
				margin: '5 10',
				labelWidth: 150
			},
			items: [{
				fieldLabel: _('Serial number'),
				itemId: 'serial'
			}, {
				fieldLabel: _('Date'),
				itemId: 'date'
			}, {
				fieldLabel: _('Driver FIO'),
				itemId: 'fio'
			}, {
				fieldLabel: _('Completed'),
				itemId: 'completed'
			}, {
				fieldLabel: _('Previous point'),
				itemId: 'previous'
			}, {
				fieldLabel: _('Next point'),
				itemId: 'next'
			}/*, {
				xtype: 'button',
				text: _('Show on map'),
				handler: this.displaySchema,
				scope: this
			}*/]
		});
		this.callParent(arguments);
	}
});
