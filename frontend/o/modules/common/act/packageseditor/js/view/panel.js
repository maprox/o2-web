/**
 *
 * PackagesEditor panel view
 * @class O.common.act.package.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.common.act.package.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.act_admin_packageseditor',

	model: 'X.Package',
	managerAlias: 'x_package',
	tabsAliases: [
		'common-package-tab-props'
	],
	listConfig: {
		xtype: 'common-package-list'
	}
});
