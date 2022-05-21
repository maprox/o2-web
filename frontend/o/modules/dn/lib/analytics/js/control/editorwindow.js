/**
 * @class O.dn.lib.analytics.EditorWindow
 */
C.utils.inherit('O.dn.lib.analytics.EditorWindow', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		// init variables
		if (this.editorPanel && this.editorPanel.findField) {
			var distributed = this.editorPanel.findField('distributed');
			if (distributed) {
				distributed.setVisible(false);
			}
		}
	},

/**
	* Returns new record object for creation
	* @protected
	* @return {Ext.data.Model}
	*/
	getNewRecord: function() {
		var record = this.callParent(arguments);
		if (record) {
			record.set('distributed', 1);
		}
		return record;
	}

});