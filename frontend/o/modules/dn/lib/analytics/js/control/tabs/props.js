/**
 * @class O.dn.lib.analytics.tab.Props
 */
C.utils.inherit('O.dn.lib.analytics.tab.Props', {
/**
	* @event findonmap
	* Fires when user press "find on map" button
	*/
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.btnFindOnMap) {
			//this.btnFindOnMap.setHandler(this.doFindOnMap, this);
		}
	},

/**
	* Handles "Find on map" button click
	* @private
	*/
	doFindOnMap: function() {
		if (this.fieldAddress) {
			this.fireEvent('findonmap', this.fieldAddress.getValue());
		}
	}
});
