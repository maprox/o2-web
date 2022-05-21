/**
 * Users editor panel
 * @class O.common.lib.usereditor.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.common.lib.usereditor.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.common_lib_usereditor',

	model: 'X.User',
	managerAlias: 'x_user',
	tabsAliases: [
		'common-usereditor-tab-props',
		'common-lib-person-tab-props',
		'common-usereditor-tab-access',
		'schedule'
	],

	tabsConfig: {
		xtype: 'common-lib-usereditor-tabs'
	},

	/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		this.list.gridStore.sort([{
			property : 'shortname',
			direction: 'ASC'
		}]);
	},

	/**
	* Returns individual tabs config objects
	* @return Object[]
	*/
	getTabsParams: function() {
		return {
			'common-lib-person-tab-props': {
				prefix: 'person.',
				hiddenElements: {
					panelpassport: true,
					paneldriverlicense: true
				},
				allowBlank: {
					lastname: true
				}
			}
		};
	},

	idFirm: null,

	listConfig: {
		columns: [{
			dataIndex: 'shortname',
			flex: 1,
			field: {
				allowBlank: false
			}
		}]
	}
});
