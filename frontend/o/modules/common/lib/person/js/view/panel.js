/**
 * Person list
 * @class O.common.lib.person.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.common.lib.person.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.common-person',

	model: 'X.Person',
	managerAlias: 'x_person',
	tabsAliases: [
		'common-lib-person-tab-props'
	],

/**
	* @constructor
	*/
	initComponent: function() {
		this.listConfig = {
			hideHeaders: false,
			columns: {
				defaults: {
					menuDisabled: true,
					flex: 1,
					field: {
						allowBlank: false
					}
				}, items: [{
					header: _('Last name'),
					dataIndex: 'lastname'
				}]
			}
		};
		this.callParent(arguments);
	}
});