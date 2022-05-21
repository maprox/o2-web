/**
 * Registration form for transport monitoring ui
 * @class O.register.MonitoringForm
 * @extend O.register.BaseForm
 */
Ext.define('O.register.MonitoringForm', {
	extend: 'O.register.BaseForm',
	alias: 'widget.registermonitoring',

/** Заголовок формы */
	title: 'Registration into transport monitoring system',
/** Сообщение об успехе */
	successMessage: 'Verify email has been sent, check your inbox.',
/** Сообщение об ошибке */
	errorMessage: 'Email already used',

/** Text fields */
	lngType: 'Organization type',
	lngTypeFiz: 'Natural person',
	lngTypeYur: 'Legal personality',
	lngEmail: 'E-mail',
	lngName: 'Name',
	lngFamilyName: 'Family name',
	lngOrganization: 'Organization',
	lngTariff: 'Tariff',
	lngAction: 'Send registration',

/**
	* Component initialization
	*/
	initComponent: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'radiogroup',
				layout: 'hbox',
				fieldLabel: this.lngType,
				items: [{
					boxLabel: this.lngTypeFiz,
					flex: 1,
					name: 'type',
					inputValue: 'fiz',
					checked: true
				}, {
					boxLabel: this.lngTypeYur,
					flex: 1,
					name: 'type',
					inputValue: 'yur'
				}],
				listeners: {
					change: {
						fn: function() {
							var value = this.getValue().type,
								organizationField =
									Ext.getCmp('organizationField');
							if (value == 'yur') {
								organizationField.show();
								organizationField.allowBlank = false;
							} else {
								organizationField.hide();
								organizationField.allowBlank = true;
							}
						}
					}
				}
			}, {
				name: 'email',
				fieldLabel: this.lngEmail,
				vtype: 'email'
			}, {
				name: 'name',
				fieldLabel: this.lngName
			}, {
				name: 'familyname',
				fieldLabel: this.lngFamilyName
			}, {
				id: 'organizationField',
				fieldLabel: this.lngOrganization,
				allowBlank: true,
				hidden: true,
				name: 'organization'
			}, {
				xtype: 'combobox',
				transform: 'register-tariff',
				editable: false,
				forceSelection: true,
				fieldLabel: this.lngTariff
			}, {
				xtype: 'tbspacer',
				height: 10
			}, {
				xtype: 'button',
				width: 180,
				text: this.lngAction,
				handler: Ext.bind(this.submit)
			}]
		});
		this.callParent(arguments);
	}
});
