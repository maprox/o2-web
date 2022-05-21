/**
 * Factory class for message manipulation
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Factory
 * @singleton
 */
Ext.define('C.lib.message.Factory', {
	alternateClassName: ['C.lib.Message'],
	inheritableStatics: {
/**
		 * @param {Ext.data.Store} store
		 * Store for keeping information about messages
		 */
		store: new C.store.Message(),

/**
		* Show message
		* @param {C.lib.message.Abstract} msg
		*/
		show: function(msg) {
			if (!msg) {
				console.warning('Empty input for O.msg.show()');
				return;
			}

			msg.store = this.store;
			if (msg.msgKey) {
				this.store.add({
					key: msg.msgKey,
					message: msg,
					lifespan: msg.lifespan,
					type: msg.messageType
				});
				msg.on('removed', this.messageRemoved, this);
			}

			msg.doDisplay();
		},

/**
		* Executes when messages fires event 'removed'
		* @param {Number/Array} key
		*/
		messageRemoved: function(key) {
			var list = key;
			if (!Ext.isArray(key)) {
				list = [key];
			}
			for (var i = 0; i < list.length; i++) {
				var record = this.store.findRecord('key', list[i]);
				if (record) {
					this.store.remove(record);
				}
			}
		},

/**
		* Removes message by key
		* @param String key
		*/
		removeByKey: function(key) {
			if (!key) {
				return;
			}

			var index = this.store.findExact('key', key);
			if (index === -1) {
				return;
			}

			var msg = this.store.getAt(index).get('message');
			msg.doRemove();
		},

/**
		* Shows confirmation dialog
		* @param {Object/String} data Configuration object or message string
		*/
		confirm: function(data) {
			var msg = Ext.create('C.lib.message.Confirm', data);
			this.show(msg);
		},

/**
		* Shows prompt dialog
		* @param {Object/String} data Configuration object or message string
		*/
		prompt: function(data) {
			// TODO O.msg.prompt()
		},

/**
		* Event message needs user callback
		* @param {Object/String} data Configuration object or message string
		*/
		event: function(data) {
			var msg = Ext.create('C.lib.message.Event', data);
			this.show(msg);
		},

/**
		* Event message needs user callback
		* @param {Object/String} data Configuration object or message string
		*/
		countdown: function(data) {
			var msg = Ext.create('C.lib.message.Countdown', data);
			this.show(msg);
		},

/**
		* Event message needs user callback
		* @param {Object/String} data Configuration object or message string
		*/
		shareConfirm: function(data) {
			var msg = Ext.create('C.lib.message.ShareConfirm', data);
			this.show(msg);
		},

/**
		* Saved data
		* @param {Object/String} data Configuration object or message string
		*/
		saved: function(data) {
			var msg = Ext.create('C.lib.message.Saved', data);
			this.show(msg);
		},

/**
		* Information
		* @param {Object/String} data Configuration object or message string
		*/
		info: function(data) {
			var msg = Ext.create('C.lib.message.Info', data);
			this.show(msg);
		},

/**
		* Warning
		* @param {Object/String} data Configuration object or message string
		*/
		warning: function(data) {
			console.warn(data);
			var msg = Ext.create('C.lib.message.Warning', data);
			this.show(msg);
		},

/**
		* Error
		* @param {Object/String} data Configuration object or message string
		*/
		error: function(data) {
			console.error(data);
			var msg = Ext.create('C.lib.message.Error', data);
			this.show(msg);
		},

/**
		* Critical error with program termination
		* @param {Object/String} data Configuration object or message string
		* @param {Integer} reasonCode Код причины
		*/
		die: function(data, reasonCode) {
			console.error(data);
			data.reasonCode = reasonCode;
			var msg = Ext.create('C.lib.message.Die', data);
			this.show(msg);
		},

/**
		* Get opened message by key
		* @param {String} key Key
		* @return {Object} HTMLElement
		* @private
		*/
		getOpenedByKey: function(key) {
			var record = this.store.findRecord('key', key);
			return record ? record.get('message') : null;
		}
	}
});
