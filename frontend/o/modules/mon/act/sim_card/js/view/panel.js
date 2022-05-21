/**
 * Sim card editor
 * @class O.mon.sim.card.Panel
 * @extends C.ui.Panel
 */
C.define('O.mon.sim.card.Panel', {

	/*extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.mon-sim-card',

	model: 'Mon.Sim.Card',
	managerAlias: 'mon_sim_card',
	tabsAliases: [
		'mon-sim-card-tab-props'
	],
	listConfig: {
		xtype: 'mon-sim-card-list'
	}*/

	extend: 'C.ui.Panel',
	alias: 'widget.mon-sim-card',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'mon-sim-card-list'
			}]
		});
		this.callParent(arguments);
		// init variables
		this.list = this.down('mon-sim-card-list');
	}
});