/**
 * @class O.x.lib.company.tab.Manager
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.x.lib.company.tab.Manager', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.x-company-tab-manager',

	/**
	 * @constructor
	 */
	initComponent: function() {
		Ext.apply(this, {
			title: _('Director'),
			itemId: 'manager',
			bodyPadding: 10,
			layout: 'anchor',
			autoScroll: true,
			defaultType: 'textfield',
			items: [{
				name: this.prefix + 'director.firstname',
				fieldLabel: _('First name'),
				allowBlank: true
			}, {
				name: this.prefix + 'director.secondname',
				fieldLabel: _('Second name'),
				allowBlank: true
			}, {
				name: this.prefix + 'director.lastname',
				fieldLabel: _('Last name'),
				allowBlank: true
			}]
		});
		this.callParent(arguments);
	}
});