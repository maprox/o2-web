/**
 * @class O.mon.lib.waylist.EditorWindow
 * @extends O.common.lib.modelslist.EditorWindow
 */
C.define('O.mon.lib.waylist.EditorWindow', {
	extend: 'O.common.lib.modelslist.EditorWindow',
	alias: 'widget.mon_waylist-editorwindow',

	/**
	 * True to hide window after successfull save of a data.
	 * Defaults to true
	 * @type {Boolean}
	 */
	hideOnSave: false,

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Waylist editor'),
			panelConfig: {
				tabsAliases: [
					'mon-waylist-tab-props',
					'mon-waylist-tab-route',
					'mon-waylist-tab-history'
				],
				commitRecordData: this.commitRecordData,
				managerIsJoined: true
			},
			model: 'Mon.Waylist',
			managerAlias: 'mon_waylist'
		});
		this.callParent(arguments);

		this.btnClose = this.down('#btnClose');
		this.btnStart = this.down('#btnStart');
		this.tabRoute = this.down('mon-waylist-tab-route');
		this.tabProps = this.down('mon-waylist-tab-props');
	},

	/**
	 * Returns items for toolbar
	 * @return {Object[]}
	 */
	getToolbarItems: function() {
		var items = this.callParent(arguments);

		var cancel = items.pop();
		cancel.text = _('Close');

		items.push({
			xtype: 'button',
			hidden: 'true',
			itemId: 'btnStart',
			text: _('Start'),
			iconCls: 'start'
		}, {
			xtype: 'button',
			hidden: 'true',
			itemId: 'btnClose',
			text: _('Finalize'),
			iconCls: 'close'
		}, {
			xtype: 'tbfill'
		}, cancel);

		return items;
	}
});