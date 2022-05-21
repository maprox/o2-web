/**
 *
 * @class O.dn.act.pricerequest.Panel
 */
C.utils.inherit('O.dn.act.pricerequest.Panel', {

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden();
		if (this.requestsList) {
			this.requestsList.on({
				select: 'onListSelect',
				accept: 'onListAccept',
				tendercreate: 'onTenderCreate',
				scope: this
			});
		}
		if (this.requestsEditor) {
			this.requestsEditor.on('list_loaded', 'onEditListLoad', this);
		}
		if (this.btnHideDisabled) {
			this.btnHideDisabled.on('toggle', 'hideDisabled', this);
		}
		if (this.requestsReport) {
			this.requestsReport.on('reload', 'onRequestReportReload', this);
		}
	},

/**
	* Notifies tabs about hide disabled button pressed
	*/
	hideDisabled: function(btn) {
		this.requestsAnswerList.hideDisabled(btn.pressed);
		this.requestsReport.hideDisabled(btn.pressed);
		this.requestsTotals.hideDisabled(btn.pressed);
	},
/**
	* Fires when record in the list grid is selected,
	* commands view grid to update
	* @record {Object Ext.data.Model}
	*/
	onListSelect: function(record) {
		this.requestsEditor.clearListSelection();
		if (record) {
			var id = record.get('id');
			this.tabPanel.enable();
			this.requestsEditor.load(id);
			if (record.get('status') > 1) {
				this.requestsEditor.disableEditor();
				this.requestsAnswers.load(id);
				this.requestsAnswers.enable();
				this.requestsReport.reloadData({id_tender: id});
				this.requestsReport.enable();
				this.requestsTotals.enable();
				this.hideDisabled(this.btnHideDisabled);
			} else {
				this.requestsEditor.enableEditor();
				this.requestsAnswers.disable();
				this.requestsAnswers.clear();
				this.requestsReport.disable();
				this.requestsTotals.disable();
			}
		} else {
			this.tabPanel.disable();
			this.requestsEditor.clearLines();
		}
	},

/**
	* TODO: COMMENT THIS
	*/
	onListAccept: function() {
		this.requestsEditor.disableEditor();
	},

/**
	* On tender create
	*/
	onTenderCreate: function() {
		this.requestsEditorList.emptyButton.toggle(true);
		this.requestsEditorLines.emptyButton.toggle(true, true);
	},

/**
	* Edit list have finished loading and passes us information
	* @param {Object} data
	*/
	onEditListLoad: function(data) {
		this.requestsList.markNonEmpty(data.haveAmount, data.requestId);
	},

/**
	* Fires when request report is reloaded
	* @param {Ext.Component} cmp
	* @param {Object} config
	*/
	onRequestReportReload: function(cmp, config) {
		this.requestsTotals.reloadData(config);
	}
});
