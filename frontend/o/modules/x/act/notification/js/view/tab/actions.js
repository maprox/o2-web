/**
 * @class O.x.act.notification.tab.Actions
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.x.act.notification.tab.Actions', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.x-notification-tab-actions',

/**
	* @constructor
	*/
	initComponent: function() {
		this.paramPanelPrefix = 'x-notification-action-';
		Ext.apply(this, {
			title: _('Actions'),
			iconCls: 'notification-actions',
			itemId: 'actions',
			bodyPadding: 0,
			autoScroll: true,
			layout: 'border',
			bodyBorder: false,
			defaults: {
				collapsible: false,
				split: true,
				bodyPadding: 10,
				border: false
			},
			items: [{
				xtype: 'x-notification-panel-action-1',
				itemId: 'action-panels-panel-1',
				region: 'west',
				floatable: false,
				width: '50%'
			}, {
				xtype: 'x-notification-panel-action-0',
				itemId: 'action-panels-panel-0',
				region: 'center',
				floatable: false,
				width: '50%'
			}]
		});
		this.callParent(arguments);
		// init variables

		this.actionPanelsPanel0 = this.down('#action-panels-panel-0');
		this.actionPanelsPanel1 = this.down('#action-panels-panel-1');

		this.actionPanels = [];
		// Index is important and must match panel statePostfix
		this.actionPanels.push(this.actionPanelsPanel0.actionPanels);
		this.actionPanels.push(this.actionPanelsPanel1.actionPanels);
	}
});
