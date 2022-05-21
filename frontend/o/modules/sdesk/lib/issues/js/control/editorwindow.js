/**
 * @class O.sdesk.lib.issues.EditorWindow
 */
C.utils.inherit('O.sdesk.lib.issues.EditorWindow', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.editorPanel.on({
			saved: this.onSaved,
			scope: this
		});
	},

/**
	* Fires when data is saved
	* @private
	*/
	onSaved: function() {
		this.fireEvent('saved');
		this.hide();
	},

/**
	* Load record data into editor panel
	* @param {Ext.data.Model} record
	*/
	load: function(record) {
		if (this.editorPanel && this.editorPanel.loadTabs) {
			this.editorPanel.loadTabs(record);
		}
		this.callParent(arguments);
	}

});