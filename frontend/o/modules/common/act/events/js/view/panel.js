/**
 * Events panel
 * @class O.common.act.events.Panel
 * @extends C.ui.Panel
 */
C.define('O.common.act.events.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_events',

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'common-lib-events-panel'
			}],
			dockedItems: [{
				xtype: 'periodchooser',
				dock: 'top',
				//height: 34,
				immediateLoad: true
			}]
		});
		this.callParent(arguments);
		// init component
		this.gridEvents = this.down('common-lib-events-panel');
	}
});