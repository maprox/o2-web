/**
 * Device list
 * @class O.mon.device.List
 * @extends O.common.lib.modelslist.List
 */
C.utils.inherit('O.mon.device.List', {
	/**
	 * Get search string
	 * @param item
	 */
	getSearchString: function(item) {
		var filterField = this.filterField ? this.filterField :
			this.grid.columns[0].dataIndex;

		var string = item.get(filterField) + '' + item.get('identifier');

		return string;
	},

	/**
	 * After new record saved
	 */
	onAfterNewRecordSaved: function() {
		// Check if it's first device added
		var devices = C.getStore('mon_device');
		if (devices.getCount() !== 1) {
			return;
		}

		O.msg.removeByKey('hint_add_new_device');
		O.msg.removeByKey('hint_enter_settings_key');
		O.msg.info({
			msgKey: 'hint_enter_settings_key',
			msg: _(
				'Please select added device and enter the settings key'),
			delay: 0
		});
	}
});