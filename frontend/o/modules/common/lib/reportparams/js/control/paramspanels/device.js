/**
 * @class O.reports.DevicePanel
 */
C.utils.inherit('O.reports.DevicePanel', {
/**
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.on('checkchange', 'onCheckChange', this);
	},

/*
	* Handles check change
	* @private
	*/
	onCheckChange: function() {
		this.fireEvent('validityChange');
	},

/*
	* Returns false if selection is invalid
	* @return {Boolean}
	*/
	isValid: function() {
		var selected = this.getSelectedItems();
		return (selected.length > 0);
	},

/**
	* Returns selected objects
	* @return {Object}
	*/
	getValue: function() {
		if (this.paramName === undefined) { return null; }
		return [{
			paramName: 'x_group_mon_device',
			paramValue: this.getSelectedGroups()
		}, {
			paramName: 'mon_device',
			paramValue: this.getSelectedObjects()
		}]
	}
});
