/**
 * Countdown display message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Countdown
 * @extends C.lib.message.Notify
 */
Ext.define('C.lib.message.ShareConfirm', {
	extend: 'C.lib.message.Notify',

/**
	 * @cfg {String} messageType
	 * Default message type for this class
	 */
	messageType: 'shareConfirm',

/**
	 * @cfg {String} title
	 * Default message title
	 */
	title: 'ShareConfirm',

/**
	 * @cfg {String} icon
	 * Default message icon
	 */
	icon: Ext.MessageBox.INFO,

/**
	 * @cfg {Number} delay
	 * Message delay before auto-hiding. 0 - no auto-hide.
	 * False - default delay from global config.
	 */
	delay: 0,

/**
	 * @cfg {String} cls
	 * Default message class
	 */
	cls: 'event'
});
