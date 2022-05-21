/**
 * 
 */
C.define('O.ui.LinkContainer', {
	extend: 'Ext.button.Button',
	alias: 'widget.link-container',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			ui: 'head-module',
			cls: 'usermenu',
			iconCls: 'usermenu',
			menu: {
				plain: true,
				cls: 'head-menu',
				items: []
			}
		});
		this.callParent(arguments)
	}

});