/**
 * Warning display message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Warning
 * @extends C.lib.message.Notify
 */
Ext.define('C.lib.message.Warning', {
	extend: 'C.lib.message.Notify',

/**
	 * @cfg {String} messageType
	 * Default message type for this class
	 */
	messageType: 'warning',

/**
	 * @cfg {String} title
	 * Default message title
	 */
	title: 'Warning',

/**
	 * @cfg {String} icon
	 * Default message icon
	 */
	icon: Ext.MessageBox.WARNING,

/**
	 * @cfg {String} cls
	 * Default message class
	 */
	cls: 'warn'
});
