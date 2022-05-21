/**
 * @class O.x.lib.company.tab.Contacts
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.x.lib.company.tab.Contacts', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.x-company-tab-contacts',

	/**
	 * @constructor
	 */
	initComponent: function() {
		// Create emails editor
		this.emailsEditor = Ext.widget('common-simplegrid', {
			alias: 'email',
			prop: 'address',
			vtype: 'email'
		});

		// Create phones editor
		this.phonesEditor = Ext.widget('common-simplegrid', {
			alias: 'phone',
			prop: 'number'
		});

		var padding = 10;
		Ext.apply(this, {
			title: _('Contacts'),
			itemId: 'contacts',
			bodyPadding: padding,
			autoScroll: true,
			layout: 'hbox',
			defaults: {
				xtype: 'fieldset',
				flex: 1,
				layout: 'fit'
			},
			items: [{
				title: _('E-mail'),
				items: [this.emailsEditor]
			}, {
				xtype: 'tbspacer',
				width: padding,
				flex: null
			}, {
				title: _('Phone numbers'),
				items: [this.phonesEditor]
			}]
		});

		this.callParent(arguments);
	}
});