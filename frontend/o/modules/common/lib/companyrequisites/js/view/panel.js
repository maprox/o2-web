/**
 * Company requisites editor panel
 * @class O.lib.panel.CompanyRequisites
 * @extends Ext.panel.Panel
 */

C.define('O.lib.panel.CompanyRequisites', {
	extend: 'Ext.form.FieldContainer',
	alias: 'widget.companyrequisites',

/**
	* Readonly flag
	* @type {Boolean}
	*/
	readonly: false,

/**
	* True to show fill in link if field is required
	* @type {Boolean}
	*/
	showFillInLinks: false,

/**
	* Visual fields configuration
	*/
	defaults: {
		anchor: '100%',
		labelWidth: 100
	},


/**
	* Language specific
	*/
	lngCompanyName: 'Name',
	lngCompanyLegalAddress: 'Legal address',
	lngCompanyLegalAddressEqualsActual: 'Legal adress equals to actual',
	lngCompanyActualAddress: 'Actual address',
	lngDirector: 'Director',
	lngDirectorLastName: 'Last name',
	lngDirectorFirstName: 'First name',
	lngDirectorSecondName: 'Second name',
	lngCompanyOGRN: 'OGRN',
	lngCompanyINN: 'INN',
	lngCompanyKPP: 'KPP',
	lngCompanyOKVED: 'OKVED',
	lngCompanyOKPO: 'OKPO',
	lngBankInfo: 'Bank information',
	lngBankName: 'Bank name',
	lngBankBIK: 'BIK',
	lngBankCurrentAccount: 'Current account',
	lngBankCorrespondentAccount: 'Correspondent account',
	lngContractInfo: 'Contracts info',
	lngRepresentedBy: '"Represented by"',
	lngRepresentedBySample: 'J. Smith acting on the basis of Statute    ',
	lngSignatory: 'Signatory',
	lngSignatorySample: 'J. Smith    ',
	lngPost: 'Post',
	lngPostSample: 'director    ',
	lngRequired: 'required',

/**
	* @constructs
	*/
	initComponent: function() {
		var defaultType = (this.readonly) ? 'displayfield' : 'textfield';

		Ext.apply(this, {
			uniqueId: Math.random(),
			defaultType: defaultType,
			items: [{
				fieldLabel: this.lngCompanyName,
				name: 'f.name'
			}, {
				xtype: 'fieldset',
				defaultType: defaultType,
				name: 'addresslegal',
				autoHeight: true,
				layout: 'anchor',
				padding: '0px',
				// Свойство border у fieldset-ов есть,
				// но оно почему-то бодро игнорируется
				style: 'border: none;',
				margin: '0px',
				items: [{
					fieldLabel: this.lngCompanyLegalAddress,
					name: 'f.addresslegal',
					anchor: this.readonly ? '100%' : '93%',
					style: {
						'float': 'left'
					},
					readOnly: !this.readonly,
					cls: this.readonly ? '' : 'x-item-disabled'
				}, {
					xtype: 'button',
					text: '<img src="' + STATIC_PATH + '/img/edit.png" />',
					anchor: '7%',
					padding: '2px',
					handler: this.editLegalAddress,
					hidden: this.readonly,
					scope: this
				}]
			}, {
				xtype: 'checkbox',
				itemId: 'checkboxAddress',
				name: 'f.actual_same_as_legal',
				fieldLabel: this.lngCompanyLegalAddressEqualsActual,
				labelWidth: 300,
				cls: 'autowidth',
				fieldStyle: 'float: right;',
				hidden: this.readonly
			}, {
				xtype: 'fieldset',
				defaultType: defaultType,
				name: 'addressactual',
				layout: 'anchor',
				padding: '0px',
				// Свойство border у fieldset-ов есть,
				// но оно почему-то бодро игнорируется
				style: 'border: none;',
				margin: '0px',
				items: [{
					fieldLabel: this.lngCompanyActualAddress,
					name: 'f.addressactual',
					anchor: this.readonly ? '100%' : '93%',
					style: {
						'float': 'left'
					},
					readOnly: !this.readonly,
					cls: this.readonly ? '' : 'x-item-disabled'
				}, {
					xtype: 'button',
					itemId: 'actualAddressButton',
					text: '<img src="'+STATIC_PATH+'/img/edit.png" />',
					anchor: '7%',
					padding: '2px',
					handler: this.editActualAddress,
					hidden: this.readonly,
					scope: this
				}]
			}, {
				xtype: 'fieldset',
				title: this.lngDirector,
				defaultType: defaultType,
				defaults: {
					anchor: '100%'
				},
				items: [{
					fieldLabel: this.lngDirectorLastName,
					name: 'f.directorlastname'
				}, {
					fieldLabel: this.lngDirectorFirstName,
					name: 'f.directorfirstname'
				}, {
					fieldLabel: this.lngDirectorSecondName,
					name: 'f.directorsecondname'
				}]
			}, {
				fieldLabel: this.lngCompanyINN,
				name: 'f.inn'
			}, {
				fieldLabel: this.lngCompanyKPP,
				name: 'f.kpp'
			}, {
				fieldLabel: this.lngCompanyOGRN,
				name: 'f.ogrn'
			}, {
				xtype: 'fieldset',
				title: this.lngBankInfo,
				defaultType: defaultType,
				defaults: {
					anchor: '100%'
				},
				items: [{
					fieldLabel: this.lngBankName,
					name: 'f.bankname'
				}, {
					fieldLabel: this.lngBankBIK,
					name: 'f.bik'
				}, {
					fieldLabel: this.lngBankCurrentAccount,
					name: 'f.bankaccount',
					vtype: 'payment_account'
				}, {
					fieldLabel: this.lngBankCorrespondentAccount,
					name: 'f.bankcorrespondentaccount'
				}]
			}, {
				fieldLabel: this.lngCompanyOKPO,
				name: 'f.okpo'
			}, {
				fieldLabel: this.lngCompanyOKVED,
				name: 'f.okved'
			}, {
				xtype: 'fieldset',
				title: this.lngContractInfo,
				defaultType: defaultType,
				defaults: {
					anchor: '100%'
				},
				items: [/*{
					fieldLabel: this.lngRepresentedBy,
					name: 'f.representedby',
					emptyText: this.lngRepresentedBySample
				}, */{
					fieldLabel: this.lngSignatory,
					name: 'f.signatory',
					emptyText: this.lngSignatorySample
				}, {
					fieldLabel: this.lngPost,
					name: 'f.post',
					emptyText: this.lngPostSample
				}]
			}]
		});
		this.callParent(arguments);

		//this.addEvents('addresschanged');

		this.fieldAddressLegal = this.down('field[name=f.addresslegal]');
		this.fieldAddressActual = this.down('field[name=f.addressactual]');
		this.checkboxAddress = this.down('#checkboxAddress');
		this.actualButton = this.down('#actualAddressButton');

		if (this.checkboxAddress) {
			this.checkboxAddress.on({
				change: this.sameAddressChecked,
				scope: this
			});
		}
	}
});