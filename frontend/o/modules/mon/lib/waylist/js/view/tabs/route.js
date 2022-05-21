/**
 * @class O.mon.lib.waylist.tab.Route
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.mon.lib.waylist.tab.Route', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.mon-waylist-tab-route',

/*  Configuration */
	bodyPadding: 0,

	/**
	 * Previously loaded record
	 * @type {O.mon.model.Waylist}
	 */
	lastRecord: null,

	/**
	 * Need to pan to selected tracks on display
	 * @type {Boolean}
	 */
	mapFocusNeeded: true,

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Route'),
			itemId: 'route',
			layout: 'border',
			defaults: {
				flex: 1,
				split: true
			}
		});

		// If the screen is wide enough, split vertically
		if ((Ext.getBody().getWidth() - 200) / 2 > 400) {
			this.initWideLayout();
		} else {
			this.initCommonLayout();
		}

		this.callParent(arguments);
		// init variables
		this.list = this.down('mon-waylist-routelist');
		this.fact = this.down('mon-waylist-routefact');
		this.map = this.down('mon-waylist-routemap');
	},

	initWideLayout: function() {
		Ext.apply(this, {
			items: [{
				layout: 'border',
				split: true,
				region:'center',
				defaults: {
					flex: 1,
					split: true
				},
				items: [{
					xtype: 'mon-waylist-routelist',
					region:'center'
				}, {
					xtype: 'mon-waylist-routefact',
					region:'south'
				}]
			}, {
				xtype: 'mon-waylist-routemap',
				hidden: true,
				split: true,
				region:'east'
			}]
		});
	},

	initCommonLayout: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'mon-waylist-routelist',
				region:'north'
			}, {
				xtype: 'mon-waylist-routefact',
				region:'center'
			}, {
				xtype: 'mon-waylist-routemap',
				region:'south'
			}]
		});
	}
});
