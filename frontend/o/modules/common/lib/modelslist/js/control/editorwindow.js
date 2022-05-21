/**
 * @class O.common.lib.modelslist.EditorWindow
 */
C.utils.inherit('O.common.lib.modelslist.EditorWindow', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.editorPanel) {
			this.editorPanel.on({
				create: this.onSave,
				update: this.onSave,
				refresh: this.syncUi,
				scope: this
			});
			// relaying the editorPanel events
			this.relayEvents(this.editorPanel, ['create', 'update']);
			this.syncUi();
		}
		this.btnSave.setHandler(this.save, this);
		this.btnReset.setHandler(this.reset, this);
		this.btnCancel.setHandler(this.btnCancelHandler, this);
	},

/**
	* Returns new record object for creation
	* @protected
	* @return {Ext.data.Model}
	*/
	getNewRecord: function() {
		return Ext.create(this.model, {});
	},

/**
	* Shows window with specified record
	* @param {Ext.data.Model} record
	*/
	execute: function(record) {
		this.reset();
		this.load(record ? record : this.getNewRecord());
		this.show();
	},

/**
	* Loads data from record into container
	* @param {Ext.data.Model} record
	*/
	load: function(record) {
		if (!this.editorPanel) { return; }
		if (!this.editorPanel.selectRecord) { return; }
		this.editorPanel.selectFirstTab();
		this.editorPanel.selectRecord(record);
		// after selecting record let's set focus on
		// the first field of the active tab
		this.editorPanel.focusField();
	},

/**
	* Synchronizes ui
	* @protected
	*/
	syncUi: function() {
		if (!this.editorPanel) { return; }
		var isDirty = this.editorPanel.isDirty();
		var isValid = this.editorPanel.isValid();
		var record  = this.editorPanel.getSelectedRecord();
		var isReadonly = (record && record.get('iseditable') === false);

		this.btnSave.setDisabled(!(isDirty && isValid) || isReadonly);
		this.btnReset.setDisabled(!isDirty || isReadonly);
	},

/**
	* Clears the fields data of window panel.
	* Used during creation of model object (to clear previous data)
	*/
	reset: function() {
		if (!this.editorPanel) { return; }
		if (!this.editorPanel.resetChanges) { return; }
		this.editorPanel.resetChanges();
	},

/**
	* Save handler
	*/
	save: function() {
		if (!this.editorPanel) { return; }
		if (!this.editorPanel.saveChanges) { return; }
		this.editorPanel.saveChanges();
	},

/**
	* "Cancel" button click handler
	* @protected
	*/
	btnCancelHandler: function() {
		this.hide();
	},

/**
	* Handles creation or updating of a record
	* @private
	*/
	onSave: function() {
		if (this.hideOnSave) {
			this.hide();
		}
	}
});