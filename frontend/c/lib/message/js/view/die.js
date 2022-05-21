/**
 * Die display message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Die
 * @extends C.lib.message.Error
 */
Ext.define('C.lib.message.Die', {
	extend: 'C.lib.message.Error',

/**
	 * @cfg {String} messageType
	 * Default message type for this class
	 */
	messageType: 'die',

/**
	 * @cfg {String} errCriticalMessage
	 * Template for critical error
	 */
	errCriticalMessage: '<p>Critical system error has occured! ' +
		'The further work is impossible.<br/>' +
		'Report on error is sent in a support service.<br/>' +
		'We apologize for inconveniences, the error will ' +
		'be corrected in the shortest terms.<br/></p>' +
		'<div class="errinfo">{0}</div>',

/**
	 * @cfg {String} title
	 * Message title
	 */
	title: 'Critical Error',

/**
	 * Callback on button click, terminates application
	 */
	fn: function() {
		this.callParent(arguments);

		O.app.terminate(this.reasonCode); // terminate programm on critical error
	}
});
