/**
 * Abstract display message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Notify
 * @extends C.lib.message.Abstract
 */
Ext.define('C.lib.message.Notify', {
	extend: 'C.lib.message.Abstract',

/**
	* Displays message
	*/
	doDisplay: function() {
		console.warn('C.lib.message.Notify is not defined');
	},

/**
	* Removes message, on timeout or on click
	*/
	doRemove: function() {
		console.warn('C.lib.message.Notify is not defined');
	},

/**
	* Hides message from sight
	*/
	doHide: function() {
		console.warn('C.lib.message.Notify is not defined');
	},

/**
	* Shows message
	*/
	doShow: function() {
		console.warn('C.lib.message.Notify is not defined');
	}
});
