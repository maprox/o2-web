/**
 * @class O.x.notification.action.AbstractList
 * @extends O.x.notification.action.Abstract
 */
Ext.define('O.x.notification.action.AbstractList', {
	extend: 'O.x.notification.action.Abstract',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'anchor',
			items: [{
				xtype: 'common-lib-modelslist-list',
				showEditButton: true,
				enableShowDeleted: false,
				enableSearch: false,
				vtype: this.vtype || '',
				height: 140
			}]
		});
		this.callParent(arguments);
		// init variables
		this.list = this.down('common-lib-modelslist-list');
	}
});