/**
 *
 * Panel with list of objects
 * @class O.groups.devices.Objects
 * @extends O.lib.grouplist.Objects
 */
C.define('O.groups.devices.Objects', {
	extend: 'O.lib.grouplist.Objects',
	alias: 'widget.listgroupsdevices_objects',

	/**
	* Component initialization
	*/
	initComponent: function() {
		this.callParent(arguments);
	},

	/**
	* Returns true if record disabled
	* @param {Ext.model.Record} record
	* @return {Boolean}
	*/
	isRecordDisabled: function(record) {
		var devices = C.get('mon_device');
		var device = devices ? devices.getByKey(record.getId()) : null;
		if (device && device.isUnconfigured()) {
			return true;
		}
		return this.callParent(arguments);
	},

	/**
	 * Fetches additional data about object
	 * @param {object} object
	 * @returns {object}
	 */
	getAdditionalParams: function(object) {
		var device = C.get('mon_device').getByKey(object.id);
		return {
			unconfigured: device ? device.isUnconfigured() : false
		}
	}
});