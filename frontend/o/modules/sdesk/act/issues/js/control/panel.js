/**
 * @class O.sdesk.issues.Panel
 */
C.utils.inherit('O.sdesk.issues.Panel', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.btnCreate.setHandler(this.doCreate, this);
		this.btnEdit.setHandler(this.doEdit, this);
		this.btnDelete.setHandler(this.doDelete, this);
	},

/**
	* Shows window for creating issue
	* @private
	*/
	doCreate: function() {
		var editorWindow = this.windowCreateIssue;
		if (!editorWindow) {
			editorWindow = Ext.widget('sdesk_issue_editorwindow', {width: 460});
			editorWindow.on({
				saved: this.onIssueCreated,
				scope: this
			});
			this.windowCreateIssue = editorWindow;
		}
		editorWindow.execute();
	},

	onIssueCreated: function() {
	},

	doEdit: function() {
		
	},

	doDelete: function() {
		
	}

});