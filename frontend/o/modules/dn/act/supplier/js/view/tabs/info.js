/**
 * @project <a href="http://maprox.net/observer">Maprox Observer</a>
 *
 * Supplier company requisites
 * @class O.act.panel.dn.SupplierInfo
 * @extends C.ui.Panel
 */
C.define('O.act.panel.dn.SupplierInfo', {
	extend: 'C.ui.Panel',
	alias: 'widget.dn_supplier_info',

/** Language specific */
//	lngPrintRequisites: 'Print company card',
	lngDetails: 'Details',
	lngContacts: 'Contacts',
	lngName: 'Name',
	lngPersonPhone: 'Phone',
	lngWorkPhone: 'Work phone',
	lngMobilePhone: 'Mobile phone',
	lngEmail: 'E-mail',

/**
	* @constructs
	*/
	initComponent: function() {
		this.phoneStore = Ext.create('Ext.data.Store', {
			model: 'O.dn.act.supplier.model.Phone',
			data: [],
			sorters: [{property: 'isprimary', direction: 'DESC'}]
		});
		this.emailStore = Ext.create('Ext.data.Store', {
			model: 'O.dn.act.supplier.model.Email',
			data: [],
			sorters: [{property: 'isprimary', direction: 'DESC'}]
		});

		var me = this;
		Ext.apply(this, {
			title: _('Requisites'),
			autoScroll: true,
			items: [{
				xtype: 'form',
				width: 462,
				border: false,
				padding: 10,
				items: [{
					xtype: 'fieldset',
					title: this.lngContacts,
					defaults: {
						anchor: '100%'
					},
					items: [{
						xtype: 'displayfield',
						fieldLabel: this.lngName,
						name: 'shortname'
					}, {
						xtype: "contactview",
						keyfield: 'number',
						store: this.phoneStore
					}, {
						xtype: "contactview",
						keyfield: 'address',
						store: this.emailStore
					}]
				}, {
					xtype: 'fieldset',
					title: this.lngDetails,
					items: [{
						defaults: {
							width: 420 // TODO Change this to anchor!
						},
						xtype: 'companyrequisites',
						readonly: true
					}]
				}]
			}],
			dockedItems: {
				xtype: 'toolbar',
				dock: 'top',
				items: [{
						xtype: 'button',
						action: 'printrequisites',
						iconCls: 'print',
						text: _('Print company card')
				}, {
						xtype: 'button',
						action: 'resetpassword',
						iconCls: 'cross',
						text: _('Reset suplier password')
				}]
			}
		});
		this.callParent(arguments);
		this.formPanel = this.down('form');
		this.formPanelRequisites = this.formPanel.down('companyrequisites');
		this.btnPrintRequisites = this.down('button[action=printrequisites]');
		this.btnResetPassword = this.down('button[action=resetpassword]');
	}
});
