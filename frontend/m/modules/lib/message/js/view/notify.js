/**
 * Abstract display message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Notify
 * @extends C.lib.message.Abstract
 */
C.utils.inherit('C.lib.message.Notify', {

/**
	* Displays message
	*/
	doDisplay: function() {
		// message length restriction
		var msg = this.config.msg.substring(0, 100);
		Ext.Msg.setZIndex(100000);
		Ext.Msg.show({
			buttons: this.config.buttons || Ext.MessageBox.OK,
			title: this.config.title,
			iconCls: this.icon,
			cls: this.config.cls,
			message: msg,
			type: this.config.type,
			fn: this.config.fn
		});
	},

/**
	* Removes message, on timeout or on click
	*/
	doRemove: function() {
		this.doHide();
	},

/**
	* Hides message from sight
	*/
	doHide: function() {
		Ext.Msg.hide();
	},

/**
	* Shows message
	*/
	doShow: function() {
		this.doDisplay();
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
