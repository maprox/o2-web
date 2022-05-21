/**
 * @class O.x.notification.param.MonSpeedRestrictions
 */
C.utils.inherit('O.x.notification.param.MonConnectionLossRestrictions', {


	/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		if (this.fieldLossTime) {
			this.fieldLossTime.on('change', 'onChange', this);
		}
	},


	/**
	* Returns an array of notification types aliases, on wich
	* this param panel is visible during initialization of "Params" tab
	* @return String[]
	*/
	getNotificationTypes: function() {
		return [
			'mon_connection_loss'
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
		if (!this.fieldLossTime) { return []; }
		var time = this.fieldLossTime.getValue();
		if (this.hasValue || time) {
			return [{
				name: 'loss_time',
				value: time
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
		if (!this.fieldLossTime) { return; }
		this.fieldLossTime.setValue(0);
		this.hasValue = false;
		Ext.each(value, function(param) {
			if (param['name'] == 'loss_time') {
				this.hasValue = true;
				this.fieldLossTime.setValue(param['value']);
				return false;
			}
		}, this);
	}
});