C.define('O.common.lib.usereditor.tab.Access', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.common-usereditor-tab-access',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Access'),
			itemId: 'access',
			iconCls: 'usereditor_access',
			bodyPadding: 15,
			autoScroll: true,
			rightLevels: []
		});
		this.callParent(arguments);
	}
});
