/**
 * Abstract dialog message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Dialog
 * @extends C.lib.message.Abstract
 */
Ext.define('C.lib.message.Dialog', {
	extend: 'C.lib.message.Abstract',

/**
	* Displays message
	*/
	doDisplay: function() {
		console.warn('C.lib.message.Dialog is not defined');
	},

/**
	* Removes message, on timeout or on click
	*/
	doRemove: function() {
		console.warn('C.lib.message.Dialog is not defined');
	},

/**
	* Hides message from sight
	*/
	doHide: function() {
		console.warn('C.lib.message.Dialog is not defined');
	},

/**
	* Shows message
	*/
	doShow: function() {
		console.warn('C.lib.message.Dialog is not defined');
	},

/**
	* Default callback function on button press
	*/
	fn: function() {
		if (this.msgKey) {
			this.fireEvent('removed', this.msgKey);
		}
	}
});
