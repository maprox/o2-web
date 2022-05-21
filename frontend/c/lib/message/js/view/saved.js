/**
 * Saved info display message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Saved
 * @extends C.lib.message.Notify
 */
Ext.define('C.lib.message.Saved', {
	extend: 'C.lib.message.Notify',

/**
	 * @cfg {String} messageType
	 * Default message type for this class
	 */
	messageType: 'saved',

/**
	 * @cfg {String} title
	 * Default message title
	 */
	title: 'Saved',

/**
	 * @cfg {String} icon
	 * Default message icon
	 */
	icon: Ext.MessageBox.INFO,

/**
	 * @cfg {String} cls
	 * Default message class
	 */
	cls: 'saved'
});
