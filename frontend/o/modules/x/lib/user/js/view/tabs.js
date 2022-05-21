/**
 * @class O.common.lib.usereditor.Tabs
 * @extends O.common.lib.modelslist.Tabs
 */
C.define('O.common.lib.usereditor.Tabs', {
	extend: 'O.common.lib.modelslist.Tabs',
	alias: 'widget.common-lib-usereditor-tabs',

/**
	 * constructor
	 */
	initComponent: function() {
		this.callParent(arguments);

		var toolbar = this.down('toolbar');

		toolbar.insert(2, {
			xtype: 'button',
			itemId: 'btnSaveAndNotify',
			text: _('Save and notify user'),
			iconCls: 'save'
		});

		this.btnSaveAndNotify = this.down('#btnSaveAndNotify');
	}
});
