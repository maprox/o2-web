/**
 * Desktop state object
 * @class M.ui.desktop.State
 */
Ext.define('M.ui.desktop.State', {
	singleton: true,

	data: {
		activetab: {
			get: function() {
				var desktop = this.getDesktop();
				if (!desktop) { return 0; }
				var item = desktop.getActiveItem();
				var itemIndex = desktop.getCardIndex(item);
				return itemIndex;
			},
			set: function(value) {
				var desktop = this.getDesktop();
				if (!desktop) { return; }
				desktop.setActiveItem(value);
			}
		}
	},

/**
	* Event binding shortcut
	* @param {Ext.util.Observable} owner
	* @param {String} eventName
	* @return {Function}
	*/
	bindEvent: function(owner, eventName) {
		return Ext.bind(owner.fireEvent, owner, [
			O.manager.State.getEventName(eventName)]);
	},

/**
	* State initialization
	* @param {Object} owner
	*/
	init: function(owner) {
		var me = this;
		owner.state = me.data;
		var desktop = owner.getDesktop();
		if (desktop) {
			desktop.on({
				afteractiveitemchange: me.bindEvent(owner, 'activetab')
			});
		}
		O.manager.State.watch(owner);
	}

});