/**
 *
 * Person contacts editor panel
 * @class O.lib.panel.PersonContacts
 * @extends Ext.panel.Panel
 */
C.define('O.lib.panel.PersonContacts', {
	extend: 'Ext.form.FieldContainer',
	alias: 'widget.personcontacts',

/**
	* Visual fields configuration
	*/
	defaults: {
		anchor: '100%',
		allowBlank: false
	},


/**
	* Language specific
	*/
	lngPersonName: 'Name',
	lngPersonPhone: 'Phone',
	lngFirstName: 'First name',
	lngSecondName: 'Second name',
	lngLastName: 'Last name',
	lngPhoneNotGiven: 'Phone is not submitted',
	lngPhoneMobile: 'Phone (mobile)',
	lngPhoneWork: 'Phone (work)',
	lngEdit: 'Edit',

/**
	* @constructs
	*/
	initComponent: function() {
		var phoneData = C.getSetting('phone');
		if (phoneData.length == 0) {
			phoneData = [{note: this.lngPhoneNotGiven}];
		}

		var emailData = C.getSetting('email');
		if (emailData.length == 0) {
			emailData = [{note: _('Email is not specified')}];
		}

		Ext.apply(this, {
			defaultType: 'displayfield',
			items: [{
				xtype: 'fieldset',
				title: this.lngPersonName,
				defaultType: 'displayfield',
				defaults: {
					anchor: '100%'
				},
				items: [{
					fieldLabel: this.lngFirstName,
					value: C.getSetting('p.firstname')
				}, {
					fieldLabel: this.lngLastName,
					value: C.getSetting('p.lastname')
				}, {
					fieldLabel: this.lngSecondName,
					value: C.getSetting('p.secondname')
				}]
			}, {
				xtype: 'contactview',
				keyfield: 'number',
				store: Ext.create('Ext.data.Store', {
					model: 'O.lib.personcontacts.model.Phone',
					data: phoneData,
					sorters: [{property: 'isprimary', direction: 'DESC'}]
				})
			}, {
				xtype: 'contactview',
				keyfield: 'address',
				store: Ext.create('Ext.data.Store', {
					model: 'O.lib.personcontacts.model.Email',
					data: emailData,
					sorters: [{property: 'isprimary', direction: 'DESC'}]
				})
			}, {
				xtype: 'component',
				html: '<a href="/admin#settings/user" target="_blank">' +
					this.lngEdit + '</a>'
			}]
		});
		this.callParent(arguments);
	}
});
