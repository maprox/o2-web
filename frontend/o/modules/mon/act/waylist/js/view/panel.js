/**
 * Monitoring waylist module
 * @class O.mon.waylist.Panel
 * @extends C.ui.Panel
 */
C.define('O.mon.waylist.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.mon-waylist-panel',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'mon_waylist_list'
			}]
		});
		this.callParent(arguments);
		// init variables
		this.list = this.down('mon_waylist_list');
	}
});