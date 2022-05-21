/**
 * @class O.dn.lib.analytics.Tabs
 */
C.utils.inherit('O.dn.lib.analytics.Tabs', {
/**
	 * constructor
	 */
	initComponent: function() {
		this.callOverridden(arguments);
		this.on('select', 'onSelectRecord', this);
		if (this.tabData) {
			this.tabData.on('activate', 'onTabActivateData', this);
		}
	},

/**
	* Loading data first time, when tab is activated
	* @private
	*/
	onTabActivateData: function() {
		var config = this.getFieldValue('config');
		if (!config || config === '') { config = '{}'; }
		config = Ext.decode(config);

		var record = this.getSelectedRecord();
		if (!record) { return; }
		var configLast = this.tabData.getConfig();
		if ((configLast.period_sdt !== config.period_sdt) ||
		    (configLast.period_edt !== config.period_edt)) {
			// we need to reload all data in the grid
			this.tabData.reloadData(config);
		} else {
			this.tabData.rebuildGrid(null, config);
		}
	},

/**
	* Record selection handler.
	* Reload data with record column config.
	* @param {Ext.Component} cmp
	* @param {Ext.data.Model} record
	*/
	onSelectRecord: function(cmd, record) {
		if (!record || !this.tabData.rendered) { return; }
		var config = record.get('config');
		if (!config || config === '') { config = '{}'; }
		this.tabData.reloadData(Ext.decode(config));
	},

/**
	* Reset changes
	*/
	resetChanges: function() {
		this.callParent(arguments);
		this.onTabActivateData();
	}
});
