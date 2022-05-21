/**
 *
 * Panel with list of objects
 * @class O.groups.devices.Objects
 * @extends O.lib.grouplist.Objects
 */
C.utils.inherit('O.groups.zones.Objects', {
	/**
	 * Fetches additional data about object before adding to collection
	 * @param {object} object
	 * @returns {object}
	 */
	getAdditionalCollectionParams: function(object) {
		return {
			devicecount: (object.inside == undefined ? 0 : object.inside.length)
		}
	},

	/**
	 * Fetches additional data about object
	 * @param {object} object
	 * @returns {object}
	 */
	getAdditionalParams: function(object) {
		return {
			devicecount: object.devicecount
		}
	},

	/**
	* Returns true if record disabled
	* @param {Ext.model.Record} record
	* @return {Boolean}
	*/
	isRecordDisabled: function(record) {
		var geofences = C.get('mon_geofence');
		if (geofences) {
			var fence = geofences.getByKey(record.getId());
			if (!fence || !fence.center_lat || !fence.center_lon) {
				return true;
			}
		}
		this.callParent(arguments);
	}
});