/**
 * Abstract display message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.ShareConfirm
 */
C.utils.inherit('C.lib.message.ShareConfirm', {

/**
	 * Different messages for different aliases
	 */
	messages: {
		'mon_device': 'You have received access for device'
	},

/**
	 * Allow to only click popup once
	 */
	singleClick: false,

/**
	* @constructor
	*/
	constructor: function(options) {
		this.callParent(arguments);
		Ext.apply(this, options || {});

		this.msg = this.getMessage();
	},

/**
	 * Returns message that depends on popup params
	 */
	getMessage: function() {
		var alias = this.params.alias;
		if (!alias || !this.messages[alias]) {
			return _('You are granted access to object') + ' "' + this.params.name
			+ '". ' + _('Please, confirm the access');
		}

		return _(this.messages['mon_device']) + ' "' + this.params.name
			+ '". ' + _('Please, confirm the access');
	},

/**
	* Removes message, on click
	*/
	doRemove: function() {
		var me = this;

		var message =
				_('Do you want to accept the share?');
		O.msg.confirm({
			msg: _(message),
			fn: function(choice) {
				// Accept the share
				var accept = false;
				if (choice === 'yes') {
					accept = true;
				}
				// Remove immediately
				me.removePopup();
				// Send decision
				Ext.Ajax.request({
					url: '/x_access/shareconfirm',
					method: 'POST',
					params: {
						accept: +accept,
						access_id: this.params.access_id,
						work_id: this.msgKey
					},
					callback: function(opts, success, response) {
						if (!success) { return; }

						var answer = C.utils.getJSON(response.responseText, opts);
						if (answer.data) {
							var data = answer.data;
						}
					},
					scope: this
				});
			},
			scope: this
		});
	},

/**
	 * Removes popup
	 */
	removePopup: function() {
		this.doHide();
		this.removeNode();
		if (this.callback && Ext.isFunction(this.callback)) {
			this.callback.call(this.callback.scope || this);
		}
		this.fireRemoved();
	},

/**
	* Clears all messages
	*/
	clearAll: function() {
		// Clear all can not be called while this type of popups exists
		return;
	}
});
