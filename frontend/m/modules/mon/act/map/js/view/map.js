/**
 * @class O.app.view.Map
 * @extends C.ui.Panel
 */
Ext.define('O.app.view.Map', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_map',

/** CONFIG */
	config: {
		itemId: 'map',
		layout: 'fit'
	},

/**
	* @construct
	* We initialize items in this method (not in config) via this.setItems,
	* because _([text]) will work only after
	* downloading appropriate user language file.
	*/
	initialize: function() {
		this.setItems([{
			itemId: 'baselayer',
			xtype: 'baselayer_map'
		}, {
			itemId: 'navigation',
			xtype: 'toolbar',
			docked: 'top',
			ui: 'dark',
			defaults: {
				iconMask: true,
				ui: 'plain'
			},
			items: [{
				xtype: 'segmentedbutton',
				allowMultiple: true,
				allowDepress: true,
				action: 'objects',
				items: [{
					iconCls: 'download',
					iconMask: true
				}]
			}, {
				xtype: 'spacer'
			}, {
				action: 'config',
				iconCls: 'settings'
			}, {
				xtype: 'segmentedbutton',
				allowMultiple: true,
				allowDepress: true,
				action: 'info',
				items: [{
					iconCls: 'info',
					iconMask: true
				}]
			}]
		}]);
		this.callParent(arguments);
	}
});
