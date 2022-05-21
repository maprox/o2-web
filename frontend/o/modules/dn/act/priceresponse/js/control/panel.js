/**
 * @class O.dn.act.priceresponse.Panel
 */
C.utils.inherit('O.dn.act.priceresponse.Panel', {

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden();

		this.responsesList = this.down('pricesresponses_list');
		this.list = this.responsesList;
		if (this.responsesList) {
			this.responsesList.on({
				select: this.onListSelect,
				accept: this.onListAccept,
				cancel: this.onListCancel,
				scope: this
			});
		}

		this.responsesEditor = this.down('pricesresponse_editor');
		if (this.responsesEditor) {
			this.responsesEditor.on({
				modified: this.onModify,
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

		if (record) {

			this.responsesEditor.load(record);
			this.responsesEditor.expand();
		} else {

			this.responsesEditor.clear();
		}
	},

/**
	* TODO COMMENT THIS!
	* @param {?} idRequest
	* @private
	*/
	onModify: function(idRequest) {
		this.responsesList.markEdited(idRequest);
	},

/**
	* TODO COMMENT THIS!
	* @private
	*/
	onListAccept: function() {
		this.responsesEditor.disableEditor();
	},

/**
	* TODO COMMENT THIS!
	* @private
	*/
	onListCancel: function() {
		this.responsesEditor.enableEditor();
	},

/**
	* Activating module panel
	* @param {Object[]} params An array of module params {name: '', value: ''}
	*/
	moduleActivate: function(params) {
		this.callParent(arguments);
		if (params && params.length) {
			var param = params[0];
			if (param.name == 'id' && param.value > 0) {
				this.list.selectById(param.value);
			} else
			if (param.name == 'id_request' && param.value > 0) {
				this.list.selectByRequestId(param.value);
			}
		}
	}
});
