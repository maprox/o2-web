/**
 * @class O.x.notification.param.Abstract
 */
C.utils.inherit('O.x.notification.param.Abstract', {
/**
	* Change handler
	* @protected
	*/
	onChange: function() {
		this.fireEvent('change', this);
	},

/**
	* Returns an array of notification types aliases, on wich
	* this param panel is visible during initialization of "Params" tab
	* @return String[]
	*/
	getNotificationTypes: function() {
		return [];
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
		return [];
	},

/**
	* Set value for current parameter
	* @param {Object[]} value
	*/
	setValue: function(value) {
		return;
	}
});