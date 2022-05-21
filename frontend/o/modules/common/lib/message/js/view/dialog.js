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

		Ext.MessageBox.show({
			buttons: this.buttons || Ext.MessageBox.OK,
			animEl: this.animEl || C.cfg.msgAnimElementId,
			title: this.title,
			icon: this.icon,
			delay: this.delay,
			cls: this.cls,
			msg: this.msg,
			type: this.type,
			fn: this.fn,
			scope: this.scope
		});

		var el = Ext.MessageBox.getEl();
		if (el) {
			el.setStyle('z-index', '100000');
		}
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
		Ext.MessageBox.hide();
	},

/**
	* Shows message
	*/
	doShow: function() {
		this.doDisplay();
	}
});
