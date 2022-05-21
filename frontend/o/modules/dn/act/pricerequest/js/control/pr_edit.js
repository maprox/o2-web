/**
 *
 * @class O.dn.act.pricerequest.Editor
 * @extends C.ui.Panel
 */
C.utils.inherit('O.dn.act.pricerequest.Editor', {

	requestId: null,

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden();

		this.addEvents(
			/**
			 * @event list_loaded
			 * Fires when edit list finishes loading
			 */
			'list_loaded'
		);

		if (this.editorList) {
			this.editorList.on({
				select: 'onListSelect',
				list_loaded: 'onListLoad',
				scope: this
			});
		}

		if (this.editorLines) {
			this.editorLines.on({
				amount_change: 'onAmountChange',
				scope: this
			});
		}
	},

/**
	* Fires when record in the list grid is selected,
	* commands view grid to update
	* @record {Object Ext.data.Model}
	*/
	onListSelect: function(record) {

		if (record && record.get('id')) {

			this.editorLines.load(record, this.requestId);
			this.editorLines.enable();
		} else {

			this.editorLines.clear();
			this.editorLines.disable();
		}
	},

	load: function(id) {
		this.requestId = id;

		this.editorList.load(id);
	},

	clearLines: function() {
		this.editorLines.clear();
		this.editorLines.disable();
	},

	clearListSelection: function() {
		this.editorList.clearSelection();
	},

	disableEditor: function() {

		this.editorLines.disableEditor();
	},

	enableEditor: function() {

		this.editorLines.enableEditor();
	},

/**
	* Edit list have finished loading and passes us information
	* Let's forward it to panel
	* @param {Object} data
	*/
	onListLoad: function(data) {
		this.fireEvent('list_loaded', data);
	},

/**
	* Lines was edited and amount changed
	* Let's write it
	* @param {Object} data
	*/
	onAmountChange: function(data) {
		this.editorList.onAmountChange(data.requestId,
			data.placeId, data.haveAmount);
	}
});
