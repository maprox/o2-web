/**
 * @fileOverview Registration form for food supplying ui
 */
/**
 * Registration form for food supplying ui
 * @class O.register.SupplyForm
 * @extend O.register.BaseForm
 */
Ext.define('O.register.SupplyForm', {
	extend: 'O.register.BaseForm',
	alias: 'widget.registersupply',

/** Заголовок формы */
	title: 'Registration into supply providing system',
/** Сообщение об успехе */
	successMessage: 'Verify email has been sent, check your inbox.',
/** Сообщение об ошибке */
	errorMessage: 'Email already used',

/** Text fields */
	lngEmail: 'E-mail',
	lngName: 'Name',
	lngFamilyName: 'Family name',
	lngWorkPhone: 'Work phone',
	lngMobilePhone: 'Mobile phone',
	lngOrganization: 'Organization',
	lngAction: 'Send registration',
	lngCompanyInfo: 'Company information',
	lngCompanyName: 'Name',
	lngCompanyLegalAddress: 'Legal address',
	lngCompanyLegalAddressEqualsActual: 'Legal adress equals to actual',
	lngCompanyActualAddress: 'Actual address',
	lngCompanyOgrn: 'OGRN',
	lngCompanyInn: 'INN',
	lngCompanyKpp: 'KPP',
	lngCompanyOkved: 'OKVED',
	lngCompanyOkpo: 'OKPO',
	lngDirector: 'Director',
	lngDirectorLastName: 'Last name',
	lngDirectorFirstName: 'First name',
	lngDirectorSecondName: 'Second name',
	lngBankInfo: 'Bank information',
	lngBankName: 'Bank name',
	lngBankBik: 'BIK',
	lngBankCurrentAccount: 'Current account',
	lngBankCorrespondentAccount: 'Correspondent account',
	lngDocs: 'Documents',
	lngCompanyEgryl: 'Extract from EGRYL',
	lngCompanyCharter: 'Copy of charter',
	lngUpload: 'Upload',
	lngUploaded: 'Uploaded file',
	lngWaitMsg: 'Please wait...',
	lngYes: 'Yes',

/**
	* Component initialization
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'hbox',
			items: [{
				xtype: 'container',
				margin: '0 10 0 0',
				layout: 'anchor',
				items: [{
					xtype: 'container',
					layout: 'anchor',
					defaults: {
						xtype: 'textfield',
						anchor: '100%',
						allowBlank: false
					},
					items: [{
						name: 'email',
						fieldLabel: this.lngEmail,
						vtype: 'email'
					}, {
						name: 'firstname',
						fieldLabel: this.lngName
					}, {
						name: 'lastname',
						fieldLabel: this.lngFamilyName
					}, {
						name: 'workphone',
						fieldLabel: this.lngWorkPhone,
						vtype: 'phone'
					}, {
						name: 'mobilephone',
						fieldLabel: this.lngMobilePhone,
						vtype: 'phone'
					}]
				}, {
					xtype: 'fieldset',
					title: this.lngCompanyInfo,
					defaults: {
						xtype: 'textfield',
						anchor: '100%',
						allowBlank: false
					},
					items: [{
						fieldLabel: this.lngCompanyName,
						name: 'organization'
					}, {
						xtype: 'addressfield',
						name: 'addresslegal',
						fieldLabel: this.lngCompanyLegalAddress
					}, {
						xtype: 'checkbox',
						itemId: 'checkboxAddress',
						name: 'actual_same_as_legal',
						fieldLabel: this.lngCompanyLegalAddressEqualsActual,
						labelWidth: 300,
						fieldStyle: 'float: right'
					}, {
						xtype: 'addressfield',
						name: 'addressactual',
						fieldLabel: this.lngCompanyActualAddress
					}, {
						xtype: 'fieldset',
						title: this.lngDirector,
						defaults: {
							xtype: 'textfield',
							anchor: '100%',
							allowBlank: false
						},
						items: [{
							fieldLabel: this.lngDirectorLastName,
							name: 'directorlastname'
						}, {
							fieldLabel: this.lngDirectorFirstName,
							name: 'directorfirstname'
						}, {
							fieldLabel: this.lngDirectorSecondName,
							name: 'directorsecondname'
						}]
					}, {
						fieldLabel: this.lngCompanyInn,
						name: 'companyinn'
					}, {
						fieldLabel: this.lngCompanyKpp,
						name: 'companykpp'
					}, {
						fieldLabel: this.lngCompanyOgrn,
						name: 'companyogrn'
					}, {
						xtype: 'fieldset',
						title: this.lngBankInfo,
						defaults: {
							xtype: 'textfield',
							anchor: '100%',
							allowBlank: false
						},
						items: [{
							fieldLabel: this.lngBankName,
							name: 'bankname'
						}, {
							fieldLabel: this.lngBankBik,
							name: 'bankbik'
						}, {
							fieldLabel: this.lngBankCurrentAccount,
							name: 'bankaccount'
						}, {
							fieldLabel: this.lngBankCorrespondentAccount,
							name: 'bankcorrespondentaccount'
						}]
					}, {
						fieldLabel: this.lngCompanyOkpo,
						name: 'companyokpo',
						allowBlank: true
					}, {
						fieldLabel: this.lngCompanyOkved,
						name: 'companyokved',
						allowBlank: true
					}]
				}, {
					xtype: 'hiddenfield',
					value: 'yur',
					name: 'type'
				}, {
					xtype: 'hiddenfield',
					value: 'supply_free',
					name: 'tariff'
				}, {
					xtype: 'tbspacer',
					height: 10
				}, {
					xtype: 'button',
					width: 180,
					text: this.lngAction,
					handler: Ext.bind(this.submit)
				}]
			}, {
				xtype: 'fieldset',
				title: this.lngDocs,
				itemId: 'files',
				width: 400,
				items: [
					this.docField('inn'),
					this.docField('ogrn'),
					this.docField('charter'),
					this.docField('egryl')
				]
			}]
		});
		this.callParent(arguments);

		this.fieldAddressLegal = this.down('field[name=addresslegal]');
		this.fieldAddressActual = this.down('field[name=addressactual]');
		this.checkboxAddress = this.down('#checkboxAddress');

		this.checkboxAddress.on({
			change: this.sameAddressChecked,
			scope: this
		});

		this.fieldAddressLegal.on({
			change: this.legalAddressChanged,
			scope: this
		});
	},

	docField: function(alias) {
		return {
			xtype: 'container',
			action: 'file',
			items: [{
				xtype: 'form',
				layout: 'anchor',
				defaults: {
					xtype: 'hiddenfield',
					allowBlank: false
				},
				items: [{
					xtype: 'filefield',
					anchor: '100%',
					name: 'file',
					labelWidth: 120,
					fieldLabel: this['lngCompany' + C.utils.ucfirst(alias)],
					buttonText: '',
					buttonConfig: {
						iconCls: 'upload-icon'
					}
				}, {
					itemId: 'hash',
					name: 'hash' + alias
				}, {
					itemId: 'extension',
					name: 'extension' + alias
				}]
			}]
		};
	}
});
