/**
 * @class O.dn.lib.warehouse.Tabs
 * @extends O.common.lib.modelslist.Tabs
 */
C.define('O.dn.lib.warehouse.Tabs', {
	extend: 'O.common.lib.modelslist.Tabs',
	alias: 'widget.dn-lib-warehouse-tabs',

/**
	 * constructor
	 */
	initComponent: function() {
		this.callParent(arguments);
		// init local variables
		this.tabMap = this.down('#map');
		this.tabProps = this.down('#properties');
	}
});
