/**
 * Registration page viewport ui
 * @class O.view.Viewport
 * @extend Ext.container.Viewport
 */
Ext.define('O.view.Viewport', {
	extend: 'Ext.container.Viewport',
	alias: 'widget.desktop',
	layout: 'fit',
	items: [{
		xtype: 'registerpanel'
	}]
});
