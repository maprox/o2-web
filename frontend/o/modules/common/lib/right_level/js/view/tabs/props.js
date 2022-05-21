/**
 * Access level editor tab properties
 * @class O.common.lib.right_level.tab.Props
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.common.lib.right_level.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.common-lib-right_level-tab-props',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Properties'),
			itemId: 'properties',
			fieldDefaults: {
				labelAlign: 'top',
				labelWidth: 140,
				anchor: '100%',
				allowBlank: true
			},
			defaults: {
				collapsible: true,
				defaultType: 'textfield',
				width: 400
			},
			defaultType: 'textfield',
			items: [{
				xtype: 'fieldcontainer',
				fieldDefaults: {
					labelAlign: 'top',
					labelWidth: 140,
					anchor: '100%',
					allowBlank: true
				},
				defaults: {
					width: 400
				},
				items: [{
					name: 'name',
					fieldLabel: _('Name'),
					allowBlank: false
				}, {
					xtype: 'textarea',
					name: 'description',
					fieldLabel: _('Description')
				}]
			}]
		});
		this.callParent(arguments);
		// init variables
		//
	}
});
