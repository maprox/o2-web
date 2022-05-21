/**
 *
 * @class O.dn.act.priceresponse.Editor
 * @extends C.ui.Panel
 */
C.utils.inherit('O.dn.act.priceresponse.Editor', {

	paymentResponseId: null,
	isEmpty: true,

/**
	* Component initialization
	*/
	initComponent: function() {

		this.callOverridden(arguments);

		this.addEvents(
			/**
			 * @modified
			 * Fires on any edit
			 */
			'modified'
		);

		this.editorList = this.down('pricesresponse_editorlist');
		this.editorList.on({
			select: this.onListSelect,
			scope: this
		});

		this.editorLines = this.down('pricesresponse_editorlines');
		this.editorLines.on({
			modified: this.onLineWrite,
			scope: this
		});
	},

/**
	* Загрузка данных
	*/
	load: function(record) {

		if (record.get('status') > 2) {
			this.editorLines.disableEditor();
		} else {
			this.editorLines.enableEditor();
		}

		this.editorList.load(record);
		this.enable();
	},

/**
	* Очистка данных
	*/
	clear: function() {
		this.editorList.clear();
		this.disable();
	},

/**
	* Fires when record in the list grid is selected,
	* commands view grid to update
	* @record {Object Ext.data.Model}
	*/
	onListSelect: function(record) {

		if (record) {

			this.editorLines.load(record);
			this.editorLines.enable();
		} else {

			this.editorLines.clear();
			this.editorLines.disable();
		}
	},

	onLineWrite: function(id) {
		this.fireEvent('modified', id);
	},

	disableEditor: function() {

		this.editorLines.disableEditor();
	},

	enableEditor: function() {

		this.editorLines.enableEditor();
	}
});
