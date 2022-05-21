/**
 * Access editor
 * @class O.common.act.access.Panel
 * @extends O.ui.TabPanel
 */
C.define('O.common.act.access.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.common_access',

/**
	* @constructs
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'otabpanel',
				items: [{
					xtype: 'common-lib-right_level-panel',
					itemId: 'right_level',
					title: _('Right levels')
				}, {
					xtype: 'common-lib-right-panel',
					itemId: 'right',
					title: _('Rights')
				}]
			}]
		});
		this.callParent(arguments);
	}
});
