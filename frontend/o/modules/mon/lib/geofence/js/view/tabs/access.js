/**
 * @class O.mon.geofence.tab.Access
 * @extends O.common.lib.modelslist.Tab
 */
Ext.define('O.mon.geofence.tab.Access', {
	extend: 'O.common.lib.shareaccess.tab.Access',
	alias: 'widget.mon-geofence-tab-access',

/**
	* Manager alias
	*/
	managerAlias: 'mon_geofence',

	/**
	 * Notify template
	 */
	notifyTemplate: 'grant_mon_geofence',

/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
	}

});
