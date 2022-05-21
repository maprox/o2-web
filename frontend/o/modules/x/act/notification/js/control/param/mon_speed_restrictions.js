/**
 * @class O.x.notification.param.MonSpeedRestrictions
 */
C.utils.inherit('O.x.notification.param.MonSpeedRestrictions', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		if (this.fieldNoNormalization) {
			this.fieldNoNormalization.on('change', 'onChange', this);
		}
	},

/**
	* Returns an array of notification types aliases, on wich
	* this param panel is visible during initialization of "Params" tab
	* @return String[]
	*/
	getNotificationTypes: function() {
		return [
			'mon_overspeed'
		];
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
		if (!this.fieldNoNormalization) { return []; }
		var check = this.fieldNoNormalization.getValue();
		if (check) {
			return [{
				name: 'no_normalization',
				value: check ? 1 : 0
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
		if (!this.fieldNoNormalization) { return; }
		this.fieldNoNormalization.setValue(false);
		Ext.each(value, function(param) {
			if (param['name'] == 'no_normalization') {
				this.fieldNoNormalization.setValue(param['value']);
				return false;
			}
		}, this);
	}
});