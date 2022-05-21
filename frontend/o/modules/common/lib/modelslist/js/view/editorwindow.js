/**
 * @class O.common.lib.modelslist.EditorWindow
 * @extends O.ui.Window
 */
C.define('O.common.lib.modelslist.EditorWindow', {
	extend: 'O.ui.Window',

	model: 'undefined-model',
	managerAlias: 'undefined-manager-alias',

/**
	* True to hide window after successfull save of a data.
	* Defaults to true
	* @type {Boolean}
	*/
	hideOnSave: true,

/*  Configuration */
	layout: 'fit',
	modal: true,

/**
	* @constructor
	*/
	initComponent: function() {
		this.panelConfig = this.panelConfig || {};
		this.panelAlias = this.panelAlias || 'common-lib-modelslist-tabs';
		Ext.apply(this, {
			items: [Ext.apply({
				xtype: this.panelAlias,
				firmId: this.firmId,
				model: this.model,
				managerAlias: this.managerAlias,
				hiddenToolbar: true
			}, this.panelConfig)],
			dockedItems: [{
				xtype: 'toolbar',
				itemId: 'toolbar',
				dock: 'top',
				enableOverflow: true,
				defaults: {
					xtype: 'button'
				},
				items: this.getToolbarItems()
			}]
		});
		this.callParent(arguments);
		// save component links
		if (this.panelAlias) {
			this.editorPanel = this.down(this.panelAlias);
		}
		this.btnSave = this.down('#btnSave');
		this.btnReset = this.down('#btnReset');
		this.btnCancel = this.down('#btnCancel');
		this.toolbar = this.down('#toolbar')
	},

/**
	 * Returns items for toolbar
     * @return {Object[]}
	 */
	getToolbarItems: function() {
		return [{
			itemId: 'btnSave',
			text: _('Save'),
			iconCls: 'save'
		}, {
			itemId: 'btnReset',
			text: _('Reset'),
			iconCls: 'reset'
		}, {
			xtype: 'tbseparator'
		}, {
			xtype: 'button',
			itemId: 'btnCancel',
			text: _('Cancel'),
			iconCls: 'cancel'
		}];
	}
});