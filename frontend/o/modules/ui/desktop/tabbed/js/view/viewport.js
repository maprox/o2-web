/**
 * @fileOverview Layout of application
 */
C.define('O.view.Viewport', {
	extend: 'Ext.container.Viewport',
	alias: 'widget.o-viewport',

/** Interface */
	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				id: 'desktop',
				xtype: 'base-container',
				border: false,
				dockedItems: [{
					id: 'header',
					xtype: 'head-container'
				}]
			}]
		});
		this.callParent(arguments);
		this.headContainer = this.down('head-container');
	}
});