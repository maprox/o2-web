/**
 * @class O.x.notification.param.MonSpeed
 */
C.utils.inherit('O.x.notification.param.MonSpeed', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		if (this.fieldSpeed) {
			this.fieldSpeed.on('change', 'onChange', this);
		}
	},

/**
	* Returns an array of notification types aliases, on wich
	* this param panel is visible during initialization of "Params" tab
	* @return String[]
	*/
	getNotificationTypes: function() {
		return ['mon_overspeed'];
	},

/**
	* Returns a value array for this parameter panel
	* Example: <pre>
	* [{
	*	"param": "mon_device",
	*	"value": 28
	* }, {
	*	"param": "x_group_mon_device",
	*	"value": 10
	* }]
	* </pre>
	* @return array
	*/
	getValue: function() {
		if (!this.fieldSpeed) { return []; }
		var speed = this.fieldSpeed.getValue();
		if (speed || (speed === 0)) {
			return [{
				name: 'speed',
				value: speed
			}];
		} else {
			return [];
		}
	},

/**
	* Set value for current parameter
	* @param {Object[]} value
	*/
	setValue: function(value) {
		if (!this.fieldSpeed) { return; }
		this.fieldSpeed.setValue(null);
		Ext.each(value, function(param) {
			if (param['name'] == 'speed') {
				this.fieldSpeed.setValue(param['value']);
				return false;
			}
		}, this);
	}
});