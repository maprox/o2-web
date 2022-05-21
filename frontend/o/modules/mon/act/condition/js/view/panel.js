/**
 * @class O.mon.act.condition.Panel
 * @extends C.ui.Panel
 */
C.define('O.mon.act.condition.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.mon-condition',

	/**
	 * Last selected group
	 */
	lastSelected: null,

	/**
	 * @constructor
	 */
	initComponent: function() {
		var list = {
			stateful: true,
			stateId: 'list-condition',
			xtype: 'mon-condition-list',
			region: 'west',
			collapsible: true,
			split: true,
			width: 300
		};

		var grid = {
			stateful: true,
			stateId: 'grid-condition',
			xtype: 'mon-condition-grid',
			region: 'center'
		};

		var info = {
			stateful: true,
			collapsible: true,
			stateId: 'info-condition',
			xtype: 'mon-condition-info',
			split: true,
			region: 'east',
			width: 700
		};

		Ext.apply(this, {
			layout: 'border',
			items: [list, grid, info]
		});
		this.callParent(arguments);

		// init component links for quick access
		this.list = this.down('mon-condition-list');
		this.grid = this.down('mon-condition-grid');
		this.info = this.down('mon-condition-info');

		this.listData = Ext.create('O.data.GroupedCollection');
	}
});