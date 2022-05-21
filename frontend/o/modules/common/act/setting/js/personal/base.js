/**
 * Класс панели личных настроек
 * @class O.comp.settings.personal.Base
 * @extends O.comp.SettingsPanel
 */
C.define('O.comp.settings.personal.Base', {
	extend: 'O.comp.SettingsPanel',
	itemId: 'user',

	title: 'Common settings',
	tabTip: 'Editing of personal settings',
	msgUILanguage: 'Language',
	msgTimeZone: 'Time zone',
	msgSyncPeriod: 'Sync time',
	msgEmail: 'E-mail',
	msgFirstName: 'First name',
	msgSecondName: 'Second name',
	msgLastName: 'Last name',
	msgWorkPhone: 'Work phone',
	msgMobilePhone: 'Mobile phone',

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

		this.emailsEditor.on({
			changed: this.fireValidation,
			dirtychange: this.fireValidation,
			scope: this
		});

		this.phonesEditor.on({
			changed: this.fireValidation,
			dirtychange: this.fireValidation,
			scope: this
		});

		var padding = 10;
		var width = 400;
		Ext.apply(this, {
			layout: {
				type: 'hbox',
				align: 'stretchmax'
			},
			defaults: {
				border: false,
				width: width
			},
			items: [{
				xtype: 'fieldcontainer',
				layout: 'vbox',
				defaults: {
					xtype: 'fieldset',
					width: width,
					collapsible: true,
					defaultType: 'textfield'
				},
				items: [{
					title: _('Base settings'),
					defaults: {
						anchor: '100%',
						labelAlign: 'top'
					},
					items: [{
						xtype: 'iconcombo',
						queryMode: 'local',
						store: C.getStore('x_lang'),
						valueField: 'id',
						displayField: 'display',
						name: 'p.lng',
						editable: false,
						fieldLabel: this.msgUILanguage,
						triggerAction: 'all'
					}, {
						xtype: 'themecombo',
						name: 'p.theme'
					}, {
						xtype: 'combobox',
						queryMode: 'local',
						store: 'store-utc',
						valueField: 'utcid',
						displayField: 'utcname',
						name: 'p.utc',
						editable: false,
						fieldLabel: this.msgTimeZone,
						triggerAction: 'all'
					}]
				}, {
					title: _('Personal settings'),
					defaults: {
						anchor: '100%',
						labelAlign: 'top'
					},
					items: [{
						fieldLabel: this.msgFirstName,
						name: 'p.firstname'
					}, {
						fieldLabel: this.msgSecondName,
						name: 'p.secondname'
					}, {
						fieldLabel: this.msgLastName,
						name: 'p.lastname'
					}]
				}, {
					title: _('Account setting'),
					hidden: !C.userHasRight('view_access_list'),
					defaults: {
						anchor: '100%',
						labelAlign: 'top'
					},
					items: [{
						fieldLabel: _('Share key'),
						name: 'share_key',
						itemId: 'shareKey',
						allowBlank: true,
						readOnly: true,
						hidden: !C.userHasRight('view_access_list')
					}, {
						xtype: 'button',
						text: _('Generate new key'),
						itemId: 'btnGenerateShareKey',
						anchor: null,
						width: null,
						hidden: !C.userHasRight('view_access_list')
					}]
				}, {
					xtype: 'button',
					text: _('Delete account'),
					itemId: 'btnDeleteAccount',
					id: 'btnDeleteAccount',
					cls: 'delete-button',
					hidden: !C.userHasRight('delete_account')
				}]
			}, {
				xtype: 'tbspacer',
				width: padding
			}, {
				layout: {
					type: 'anchor',
					align: 'stretchmax'
				},
				defaults: {
					xtype: 'fieldset',
					width: width
				},
				items: [{
					title: _('E-mail'),
					items: [this.emailsEditor]
				}, {
					title: _('Phone numbers'),
					items: [this.phonesEditor]
				}]
			}]
		});
		this.callParent(arguments);

		this.btnGenerateShareKey = this.down('#btnGenerateShareKey');
		this.shareKeyField = this.down('#shareKey');
		this.btnDeleteAccount = this.down('#btnDeleteAccount');

		if (this.btnGenerateShareKey) {
			this.btnGenerateShareKey.setHandler(this.generateShareKey, this);
		}
		if (this.btnDeleteAccount) {
			this.btnDeleteAccount.on('click',
				this.onBtnDeleteAccountClick, this);
		}
	},

/**
	* Generates ashare key for firm
	*/
	generateShareKey: function() {
		var field = this.shareKeyField;
		if (!field) { return; }
		var button = this.btnGenerateShareKey;
		button.setDisabled(true);
		Ext.Ajax.request({
			url: '/x_user/generateapikey?type=share_key',
			callback: function(request, result, response) {
				button.setDisabled(false);
				var answer = C.utils.getJSON(response.responseText);
				if (answer.key) {
					var value = answer.key;
					field.setValue(value);
				}
			}
		});
	},

/**
	* Fill in the form panel fields
	* @protected
	*/
	applyData: function() {
		this.callParent(arguments);

		C.get('settings', function(settings) {
			this.emailsEditor.setData(settings.get('email').value);
			this.phonesEditor.setData(settings.get('phone').value);
		}, this);
	},

/**
	* Функция, которая возвращает измененные пользователем настройки<br/>
	* Может быть переопредела в потомках, при необходимости
	* @protected
	*/
	getChangedData: function() {
		var result = this.callParent(arguments);

		if (this.emailsEditor.isDirty()) {
			result.push({id: 'email', value: this.emailsEditor.getData()});
		}
		if (this.phonesEditor.isDirty()) {
			result.push({id: 'phone', value: this.phonesEditor.getData()});
		}

		return result;
	},

/**
	* Delete account click
	*/
	onBtnDeleteAccountClick: function() {
		var me = this;
		O.msg.confirm({
			msg: _('Your account will be removed permanently!')
				+ '<br />'
				+ _('All your objects will be deleted: devices, users, etc.')
				+ '<br />'
				+ _('Do you really want to delete your account?'),
			fn: function(buttonId) {
				if (buttonId != 'yes') { return; }
				me.setLoading(true);
				Ext.Ajax.request({
					url: '/x_firm/deleteaccount',
					method: 'put',
					scope: this,
					success: function(response) {
						// Do nothing
						// Node.js will logout all firm users
					}
				});
			},
			scope: this
		});
	},

/**
	* Sets default data
	*/
	setDefaultData: function() {
		this.callParent(arguments);

		C.get('settings', function(settings){
			this.emailsEditor.setData(settings.get('email').value);
			this.phonesEditor.setData(settings.get('phone').value);
		}, this);
	},

/**
	* Have changes
	*/
	haveDirty: function() {
		return (
			this.getForm().isDirty() ||
			this.emailsEditor.isDirty() ||
			this.phonesEditor.isDirty() ||
			this.emailsEditor.isNewEntryDirty() ||
			this.phonesEditor.isNewEntryDirty()
		);
	},

	fireValidation: function() {
		this.fireEvent('clientvalidation', this.getValidateForm());
	}
});

Ext.data.StoreMgr.add('personal.base', {
	type: O.comp.settings.personal.Base,
	accessible: function() {
		return true;
	}
});
