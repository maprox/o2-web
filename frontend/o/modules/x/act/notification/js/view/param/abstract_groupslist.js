/**
 * @class O.x.notification.param.AbstractGroupslist
 * @extends O.x.notification.param.Abstract
 */
Ext.define('O.x.notification.param.AbstractGroupslist', {
	extend: 'O.x.notification.param.Abstract',

	/* visual config */
	height: 300,
	listType: null,
	tableAlias: null,

/**
	* @constructor
	*/
	initComponent: function() {
		if (this.listType) {
			Ext.apply(this, {
				layout: 'fit',
				items: [{
					xtype: this.listType,
					multiSelectObjects: true,
					multiSelectGroups: true
				}]
			});
		}
		this.callParent(arguments);
		// init components
		this.itemsList = this.down(this.listType);
	}
});