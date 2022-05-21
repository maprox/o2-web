/**
 * User common properties tab
 * @class O.common.lib.usereditor.tab.Props
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.common.lib.usereditor.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.common-usereditor-tab-props',
/**
	* @constructor
	*/
	initComponent: function() {
		var id = Ext.id();
		Ext.apply(this, {
			title: _('Properties'),
			itemId: 'properties',
			defaults: {
				xtype: 'textfield',
				labelAlign: 'top',
				width: 400
			},
			layout: 'anchor',
			autoScroll: true,
			items: [{
				fieldLabel: _('Name'),
				name: 'shortname',
				allowBlank: false
			}, {
				fieldLabel: _('Login'),
				name: 'login',
				vtype: 'login',
				msgTarget: 'side'
			}, {
				xtype: 'fieldset',
				title: _('Change password'),
				collapsible: true,
				layout: 'anchor',
				itemId: 'changePassword',
				defaults: {
					xtype: 'textfield',
					inputType: 'password',
					vtype: 'password',
					minLength: 4,
					anchor: '100%'
				},
				items: [{
					id: id,
					fieldLabel: _('Password'),
					name: 'password'
				}, {
					fieldLabel: _('Confirm'),
					name: 'password_confirm',
					initialPassField: id
				}, {
					xtype: 'passgen',
					itemId: 'passgen'
				}]
			}, {
				xtype: 'checkbox',
				boxLabel: _('Request change password at next logon'),
				name: 'need_password_change',
				inputValue: '1',
				padding: '0 0 10 0'
			}, {
				xtype: 'textfield',
				fieldLabel: _('Api key'),
				labelWidth: 60,
				name: 'api_key',
				readOnly: true
			}, {
				xtype: 'button',
				text: _('Generate new key'),
				itemId: 'btnGenerateApiKey',
				width: null
			}]
		});
		this.callParent(arguments);
		// init variables
		this.fieldLogin = this.findField('login');
		this.fieldPassword = this.findField('password');
		this.fieldPasswordConfirm = this.findField('password_confirm');
		this.fieldsetPassword = this.down('#changePassword');
		this.btnGenerateApiKey = this.down('#btnGenerateApiKey');

		this.passgen = this.down('#passgen');
		this.passgen.bindFields([this.fieldPassword,
			this.fieldPasswordConfirm]);
	}
});
