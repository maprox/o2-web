/**
 *
 * Класс настройки приветственного текста
 * @class O.comp.settings.Welcome
 * @extends O.comp.SettingsPanel
 */
C.define('O.comp.settings.Welcome', {
	extend: 'O.comp.SettingsPanel',
	itemId: 'welcome',

	title: 'Welcome text',
	tabTip: 'Editing of welcome text',
	msgWelcomeText: 'Welcome text',

	initComponent: function() {
		Ext.apply(this, {
			layout: {
				type: 'anchor'
			},
			border: 0,
			items: [{
				fieldLabel: this.msgWelcomeText,
				xtype: 'htmleditor',
				name: 'f.welcome_text',
				height: 250,
				prevValue: C.getSetting('f.welcome_text')
			}]
		});
		this.callParent(arguments);
		this.htmlEditor = this.down('htmleditor');
		this.htmlEditor.on({
			sync: function(field, value) {
				if (value != this.prevValue) {
					this.prevValue = value;
					this.fireEvent('htmleditorchange', this, value);
				}
			},
			scope: this.htmlEditor
		});
		this.htmlEditor.on({
			htmleditorchange: function(field, value) {
				this.getForm().fireEvent('dirtychange', this.getForm(),
					value != field.originalValue);
			},
			scope: this
		});
	}
});

Ext.data.StoreMgr.add('welcome.base', {
	type: O.comp.settings.Welcome,
	accessible: function() {
		return C.userHasRight('module_settings_firm');
	}
});
