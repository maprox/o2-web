/**
 * @class O.dn.lib.analytics.tab.Props
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.dn.lib.analytics.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.dn-analytics-tab-props',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Properties'),
			itemId: 'properties',
			iconCls: 'dn-analytics-props',
			autoScroll: true,
			layout: 'anchor',
			items: [{
				fieldLabel: _('Name'),
				xtype: 'textfield',
				name: 'name'
			}, {
				fieldLabel: _('Note'),
				xtype: 'textarea',
				name: 'note'
			}]
		});
		this.callParent(arguments);
		// init variables
	}
});
