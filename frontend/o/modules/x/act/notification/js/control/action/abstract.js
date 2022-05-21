/**
 * @class O.x.notification.action.Abstract
 */
C.utils.inherit('O.x.notification.action.Abstract', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		// init handlers
		this.on({
			expand: 'onChange',
			collapse: 'onChange',
			scope: this
		});
	},

/**
	* Change handler
	* @protected
	*/
	onChange: function() {
		if (!this.loading) {
			this.fireEvent('change', this);
		}
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