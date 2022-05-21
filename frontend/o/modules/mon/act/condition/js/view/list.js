/**
 *
 * Panel with list of object groups
 * @class O.mon.act.condition.List
 * @extends O.lib.abstract.groupslist.Groups
 */
C.define('O.mon.act.condition.List', {
	extend: 'O.lib.grouplist.Groups',
	alias: 'widget.mon-condition-list',

	classAlias: 'mon_device',
	multiSelect: false,

	/**
	 * Component initialization
	 */
	initComponent: function() {
		Ext.apply(this, {
			title: _('Groups')
		});

		this.callParent(arguments);
	}
});
