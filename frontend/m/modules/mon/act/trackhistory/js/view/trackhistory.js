/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
/**
 * Track history panel
 * @class O.app.view.TrackHistory
 * @extend C.ui.Panel
 */
Ext.define('O.app.view.TrackHistory', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_trackhistory',

	config: {
		itemId: 'tracks',
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
			xtype: 'baselayer_trackhistory'
		}, {
			itemId: 'periodchooser',
			xtype: 'periodchooser',
			docked: 'top',
			immediateLoad: true,
			beforeItems: [{
				xtype: 'segmentedbutton',
				allowMultiple: true,
				itemId: 'groupsbutton',
				items: [{
					iconCls: 'download',
					iconMask: true
				}]
			}, {
				xtype: 'spacer'
			}],
			afterItems: [{
				xtype: 'spacer'
			}, {
				xtype: 'segmentedbutton',
				allowMultiple: true,
				itemId: 'tracksbutton',
				items: [{
					iconCls: 'search',
					iconMask: true
				}]
			}]
		}]);
		this.callParent(arguments);
	}
});
