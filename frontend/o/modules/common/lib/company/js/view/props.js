/**
 * @class O.x.lib.company.tab.Props
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.x.lib.company.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.x-company-tab-props',

	/**
	 * @constructor
	 */
	initComponent: function() {
		Ext.apply(this, {
			title: _('Properties'),
			itemId: 'properties',
			bodyPadding: 10,
			layout: 'anchor',
			autoScroll: true,
			defaultType: 'textfield',
			items: [{
				xtype: 'panel',
				border: false,
				defaults: {
					xtype: 'textfield',
					labelAlign: 'top',
					width: 400
				},
				items: [{
					name: this.prefix + 'name',
					fieldLabel: _('Name'),
					allowBlank: false
				}, {
					name: this.prefix + 'fullname',
					fieldLabel: _('Full name'),
					allowBlank: true
				}, {
					xtype: 'addressfield',
					name: this.prefix + 'id_address_legal',
					fieldLabel: _('Legal address')
				}, {
					xtype: 'checkbox',
					itemId: 'checkboxAddress',
					name: this.prefix + 'actual_same_as_legal',
					fieldLabel: _('Actual address the same as legal'),
					labelWidth: 300,
					uncheckedValue: null,
					fieldStyle: 'float: right',
					labelAlign: 'left'
				}, {
					xtype: 'addressfield',
					name: this.prefix + 'id_address_physical',
					fieldLabel: _('Actual address')
				}, {
					name: this.prefix + 'inn',
					fieldLabel: _('INN'),
					allowBlank: true
				}, {
					name: this.prefix + 'kpp',
					fieldLabel: _('KPP'),
					allowBlank: true
				}, {
					name: this.prefix + 'ogrn',
					fieldLabel: _('OGRN'),
					allowBlank: true
				}, {
					name: this.prefix + 'okpo',
					fieldLabel: _('OKPO'),
					allowBlank: true
				}, {
					name: this.prefix + 'okved',
					fieldLabel: _('OKVED'),
					allowBlank: true
				}]
			}]
		});
		this.callParent(arguments);
		this.fieldAddressLegal = this.down('field[name=' +
			this.prefix + 'id_address_legal]');
		this.fieldAddressActual = this.down('field[name=' +
			this.prefix + 'id_address_physical]');
		this.checkboxAddress = this.down('#checkboxAddress');
	}
});