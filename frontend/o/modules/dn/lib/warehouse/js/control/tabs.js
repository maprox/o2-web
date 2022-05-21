/**
 * @class O.dn.lib.warehouse.Tabs
 */
C.utils.inherit('O.dn.lib.warehouse.Tabs', {
/**
	 * constructor
	 */
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.tabProps) {
			this.tabProps.on('findonmap', 'doFindOnMap', this);
		}
	},

/**
	* Search specified address on map
	* @param {String} address Address for geocoding
	* @private
	*/
	doFindOnMap: function(address) {
		if (this.tabMap && this.tabMap.doFindOnMap) {
			this.tabs.setActiveTab(this.tabMap);
			this.tabMap.doFindOnMap(address);
		}
	}
});
