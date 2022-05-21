/**
 * Abstract message
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.message.Abstract
 * @extends Ext.Component
 */
Ext.define('C.lib.message.Abstract', {
	extend: 'Ext.Component',

/**
	* @event removed
	* Fires after message is dismissed.
	* @param {Number} msgKey
	*/

/**
	* Container div identifier
	* @type {String}
	*/
	containerDivId: 'notifications',

/**
	* Constructs
	* @param {Object} data
	*/
	constructor: function(data) {
		var config = {fromString: true};
		if (data) {
			if (Ext.isString(data)) {
				config.msg = data;
			} else {
				if (data.errors) { // Falcon_Answer object
					data = {msg: C.err.fmtAll(data.errors)};
				}
				config = Ext.apply(data, {fromString: false});
			}
		}
		return this.callParent([config]);
	},

/**
	* Returns container for notify box
	* @return Ext.Element
	*/
	getNotifyContainer: function() {
		var notifyContainer = Ext.get(this.containerDivId);
		if (!notifyContainer) {
			notifyContainer = Ext.core.DomHelper.insertFirst(
				document.body, {id: this.containerDivId}, true);
		}
		return notifyContainer;
	},

/**
	* Returns container for notify box
	* @return Ext.Element
	*/
	getItemsContainer: function() {
		var notifyContainer = this.getNotifyContainer();
		if (!notifyContainer) { return null; }
		var cls = 'container';
		var itemsContainer = notifyContainer.down('.' + cls);
		if (!itemsContainer) {
			itemsContainer = Ext.core.DomHelper.insertFirst(
				notifyContainer, {cls: cls}, true);
		}
		return itemsContainer;
	}
});
