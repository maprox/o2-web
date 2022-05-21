/**
 * Confirm display message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Confirm
 * @extends C.lib.message.Dialog
 */
Ext.define('C.lib.message.Confirm', {
	extend: 'C.lib.message.Dialog',

/**
	 * @cfg {String} messageType
	 * Default message type for this class
	 */
	messageType: 'confirm',

/**
	 * @cfg {String} title
	 * Default message title
	 */
	title: 'Confirmation',

/**
	 * @cfg {String} icon
	 * Default message icon
	 */
	icon: Ext.MessageBox.QUESTION,

/**
	 * @cfg {String} buttons
	 * Default message buttons
	 */
	buttons: Ext.MessageBox.YESNO
});
