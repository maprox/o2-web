/**
 * Right level list
 * @class O.common.lib.right_level.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.common.lib.right_level.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.common-lib-right_level-panel',

	model: 'X.Right_level',
	managerAlias: 'x_right_level',
	tabsAliases: [
		'common-lib-right_level-tab-props',
		'common-lib-right_level-tab-rights'
	],
	listConfig: {
		xtype: 'common-right_level-list'
	}
});