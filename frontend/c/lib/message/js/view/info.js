/**
 * Info display message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Info
 * @extends C.lib.message.Notify
 */
Ext.define('C.lib.message.Info', {
	extend: 'C.lib.message.Notify',

/**
	 * @cfg {String} messageType
	 * Default message type for this class
	 */
	messageType: 'info',

/**
	 * @cfg {String} title
	 * Default message title
	 */
	title: 'Information',

/**
	 * @cfg {String} icon
	 * Default message icon
	 */
	icon: Ext.MessageBox.INFO,

/**
	 * @cfg {String} cls
	 * Default message class
	 */
	cls: 'info'
});
