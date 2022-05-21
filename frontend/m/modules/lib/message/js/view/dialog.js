/**
 * Abstract dialog message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Dialog
 * @extends C.lib.message.Abstract
 */
C.utils.inherit('C.lib.message.Dialog', {

/**
	* Displays message
	*/
	doDisplay: function() {
		// message length restriction
		var msg = this.config.msg.substring(0, 100);
		Ext.Msg.setZIndex(100000);
		Ext.Msg.show({
			buttons: this.buttons || Ext.MessageBox.OK,
			title: this.config.title,
			iconCls: this.icon,
			cls: this.cls,
			message: msg,
			type: this.config.type,
			fn: this.fn
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
	}
});
