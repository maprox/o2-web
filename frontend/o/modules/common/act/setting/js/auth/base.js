/**
 * Класс панели настроек авторизации (смена пароля)<br/>
 * @class O.comp.settings.auth.Base
 * @extends O.comp.SettingsPanel
 */
C.define('O.comp.settings.auth.Base', {
	extend: 'O.comp.SettingsPanel',
	itemId: 'auth',

	initComponent: function() {
		var Id = Ext.id();
		// конфигурация
		Ext.apply(this, {
			title: _('Authorization'),
			defaultType: 'textfield',
			defaults: {
				width: 300,
				labelAlign: 'top',
				minLength: 6
			},
			items: [{
				fieldLabel: _('Login'),
				name: 'p.login',
				readOnly: true
			}, {
				fieldLabel: _('Current password'),
				name: 'p.password',
				inputType: 'password'
			}, {
				fieldLabel: _('New password'),
				id: Id,
				itemId: 'new-password',
				name: 'p.password_new',
				inputType: 'password'
			}, {
				fieldLabel: _('Password confirmation'),
				name: 'p.password_confirm',
				itemId: 'confirm',
				inputType: 'password',
				vtype: 'password',
				initialPassField: Id
			}, {
				xtype: 'passgen',
				itemId: 'passgen'
			}, {
				xtype: 'textfield',
				fieldLabel: _('Api key'),
				labelWidth: 60,
				name: 'api_key',
				itemId: 'apiKey',
				readOnly: true
			}, {
				xtype: 'button',
				text: _('Generate new key'),
				itemId: 'btnGenerateApiKey',
				anchor: null,
				width: null
			}]
		});
		this.callParent(arguments);
		this.btnGenerateApiKey = this.down('#btnGenerateApiKey');
		this.apiKeyField = this.down('#apiKey');
		if (this.btnGenerateApiKey) {
			this.btnGenerateApiKey.setHandler(this.generateApiKey, this);
		}

		this.newPassword = this.down('#new-password');
		this.confirm = this.down('#confirm');
		this.passgen = this.down('#passgen');
		this.passgen.bindFields([this.newPassword, this.confirm])
	},

/**
	* Returns user settings collection
	* @param {Function} fn - Callback function
	* @param {Object} scope - Callback function scope
	*/
	getSettings: function(fn, scope) {
		return C.get('settings', function(s, success) {
			if (success) {
				s.addAll([
					{id: 'p.password'},
					{id: 'p.password_new'},
					{id: 'p.password_confirm'}
				]);
			}
			fn.call(scope, s, success);
		}, scope);
	},

/**
	* Generates api_key for user
	*/
	generateApiKey: function() {
		var field = this.apiKeyField;
		if (!field) { return; }
		var button = this.btnGenerateApiKey;
		button.setDisabled(true);
		Ext.Ajax.request({
			url: '/x_user/generateapikey',
			callback: function(request, result, response) {
				button.setDisabled(false);
				var answer = C.utils.getJSON(response.responseText);
				if (answer.key) {
					var value = answer.key;
					field.setValue(value);
				}
			}
		});
	}

});

Ext.data.StoreMgr.add('auth.base', {
	type: O.comp.settings.auth.Base,
	accessible: function() {
		return C.userHasRight('module_settings_password_change');
	}
});
