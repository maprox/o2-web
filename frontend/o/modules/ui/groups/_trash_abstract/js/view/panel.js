/**
 *
 * @class O.ui.groups.Zones
 * @extends O.lib.abstract.GroupsList
 */
C.define('O.ui.groups.Abstract', {
	extend: 'O.lib.abstract.GroupsList',
	alias: 'widget.listgroupsabstract',
	itemId: 'models',

	title: 'Model',
	classAlias: 'models',

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callParent(arguments);
	}

});