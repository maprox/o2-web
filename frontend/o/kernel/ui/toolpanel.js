/**
 */
/**
 * Base draggable tool panel class
 * @class O.ui.ToolPanel
 * @extends Ext.panel.Panel
 */
Ext.define('O.ui.ToolPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.toolpanel',

	headerPosition: 'top',
	collapsible: true,
	collapseDirection: 'top',
	hideCollapseTool: true,
	titleCollapse: true,
	animCollapse: false,

	constrain: true,
	resizable: true,
	border: true,
	//draggable: true,

	iconCls: 'w_baseicon',

	initComponent: function() {
		Ext.apply(this, {
			getState: function() {
				var o = {
					collapsed: this.collapsed
				};
				return o;
			}
		});
		this.callParent(arguments);
		this.on({
			expand: function() {
				var me = this;
				if (me.ownerCt) {
					me.ownerCt.doLayout();
				}
			},
			scope: this
		});
	}
});
