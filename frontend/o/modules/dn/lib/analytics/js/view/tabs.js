/**
 * @class O.dn.lib.analytics.Tabs
 * @extends O.common.lib.modelslist.Tabs
 */
C.define('O.dn.lib.analytics.Tabs', {
	extend: 'O.common.lib.modelslist.Tabs',
	alias: 'widget.dn-lib-analytics-tabs',

/**
	 * constructor
	 */
	initComponent: function() {
		this.callParent(arguments);
		// init local variables
		this.tabProps = this.down('#properties');
		this.tabSettings = this.down('#settings');
		this.tabData = this.down('#report-data');
	}
});
