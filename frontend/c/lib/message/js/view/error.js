/**
 * Error display message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Error
 * @extends C.lib.message.Dialog
 */
Ext.define('C.lib.message.Error', {
	extend: 'C.lib.message.Dialog',

/**
	 * @cfg {String} messageType
	 * Default message type for this class
	 */
	messageType: 'error',

/**
	 * @cfg {String} title
	 * Default message title
	 */
	title: 'Error',

/**
	 * @cfg {String} icon
	 * Default message icon
	 */
	icon: Ext.MessageBox.ERROR,

/**
	 * @cfg {String} cls
	 * Default message class
	 */
	cls: 'error'
});
