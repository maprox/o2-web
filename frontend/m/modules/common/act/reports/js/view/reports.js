/**
 * @copyright  2012, Maprox LLC
 */
/**
 * Reports panel
 * @class O.app.view.Reports
 * @extend C.ui.Panel
 */
Ext.define('O.app.view.Reports', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_reports',

	config: {
		items: [{
			xtype: 'toolbar',
			dock: 'top',
			title: 'Reports',
			items: [
				{
					text: 'button'
				},
				{
					iconCls: 'address_book'
				},
				{
					iconCls: 'battery_low',
					iconAlign: 'right',
					text: 'Battery'
				},
				{
					text: 'Chat',
					iconCls: 'chat'
				},
			]
		}, {
			xtype: 'periodchooser'
		}]
	}
});
