/**
 * @class O.mon.lib.fuel.consumption.report.EditorWindow
 */
C.utils.inherit('O.mon.lib.fuel.consumption.report.EditorWindow', {
/**
	* @constructor
	*/
	initComponent: function() {

		this.callOverridden(arguments);
		this.editorPanel.on('beforetabchange', 'onBeforeTabChange', this);

		// Hide toolbar
		this.toolbar.hide();

		// Hide tabbar
		this.editorPanel.tabs.tabBar.hide();
		//this.editorPanel.on('select', this.onRecordSelect, this);
	},

/**
	* Shows window with specified record
	* @param {Ext.data.Model} record
	*/
	execute: function(record) {
		this.callParent(arguments);
	},

/**
	* Clears the fields data of window panel.
	* Used during creation of model object (to clear previous data)
	*/
	reset: function() {
		this.callParent(arguments);
	},

/**
	* Handler of tab changing
	* @param {Ext.tab.Panel} cmp
	* @param {Ext.Panel} tab
	* @private
	*/
	onBeforeTabChange: function(cmp, tab) {
		/*var record  = this.editorPanel.getSelectedRecord();
		if (!record.getId() && tab.itemId === 'item') {
			if (this.editorPanel.isDirty()) {
				O.msg.confirm({
					msg: _('You must save the way-list ' +
						'before changing its route.') + '<br/>' +
						_('Save the way-list?'),
					fn: function(buttonId) {
						if (buttonId != 'yes') { return; }
						this.tabWaitForSelection = tab;
						this.editorPanel.saveChanges();
					},
					scope: this
				});
			} else {
				O.msg.info(_('Please, fill properties and save the report'));
			}
			return false;
		}*/
	},

/**
	* Handles creation or updating of a record
	* @private
	*/
	onSave: function() {
		if (this.tabWaitForSelection) {
			this.editorPanel.selectTab(this.tabWaitForSelection);
			this.tabWaitForSelection = null;
			this.hideOnSave = false;
		}
		this.callOverridden(arguments);
		this.hideOnSave = true;
	}
});